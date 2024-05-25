import React, { useEffect, useState } from "react";
import "./bookinglist.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Rating } from 'react-simple-star-rating';
import { ImagetoBase64 } from "../../utility/ImagetoBase64";
import { useNavigate } from "react-router-dom";

function BookingList(props) {
  const userData = useSelector((state) => state.user);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const [photos, setPhotos] = useState({}); // State for photos for each booking

  const handleImageChange = async (e, bookingId) => {
    const files = e.target.files;
    const newImageUrls = await Promise.all(
      Array.from(files).map(file => ImagetoBase64(file))
    );
    setPhotos(prevPhotos => ({
      ...prevPhotos,
      [bookingId]: [...(prevPhotos[bookingId] || []), ...newImageUrls]
    }));
  };

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
  };

  const [dataLeave, setDataLeave] = useState({});
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://bookinghotel-dh55.onrender.com/api/booking/user/${userData._id}`
        );
        setDataLeave(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userData._id]);

  const [comment, setComment] = useState("Good");

  const handleReview = async (hotelId, bookingId) => {
    const review = {
      hotel: hotelId,
      user: userData._id,
      rating: rating,
      comment: comment,
      photos: photos[bookingId] || []
    };
    try {
      await axios.post(
        `http://localhost:5000/api/review`, review
      );
      await axios.put(`http://localhost:5000/api/booking/${bookingId}`, { isRated: true });
      alert("Đánh giá thành công");
      navigate("/hotels");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <section className="booking ">
        <div lg="8" className="booking__top">
          <h4 className="mb-4 fw-bold">
            <i className="uil uil-angle-left"></i>Danh sách đặt phòng
          </h4>
        </div>

        <div className="information">
          <p className="mb-4 fw-bold">Lịch sử đặt phòng của bạn</p>
          <div className="wrapper booking__list">
            {Array.isArray(dataLeave) &&
              dataLeave.map((item) => {
                return (
                  <div key={item._id} className="left">
                    {item.rooms.map((room, roomIndex) => (
                      <div key={room.roomId} className="total__wrapper line">
                        <div className="total line">
                          <img src={item.hotel.photos[0]} alt={item.nameHotel} />
                        </div>
                        <div className="total line">
                          <p>Khách sạn: </p>
                          <p>{item.nameHotel}</p>
                        </div>
                        <div className="total line">
                          <p>Địa chỉ: </p>
                          <p>{`${item.hotel.address}, ${item.hotel.city}`}</p>
                        </div>
                        <div className="total line">
                          <p>Số phòng:</p>
                          <p>
                            {room.roomNumbers.map((roomNumber, numberIndex) => (
                              <span key={numberIndex}>{roomNumber.number}</span>
                            ))}
                          </p>
                        </div>
                        <div className="total line">
                          <p>Ngày đặt / trả phòng:</p>
                          <p>
                            {room.roomNumbers.map((roomNumber, numberIndex) => (
                              <div
                                key={numberIndex}
                                style={{ display: "flex" }}
                              >
                                {roomNumber.unavailableDates.map(
                                  (date, index) => (
                                    <p key={index}>
                                      {new Date(date).toLocaleDateString(
                                        "en-GB"
                                      )}{" "}
                                      {index <
                                        roomNumber.unavailableDates.length -
                                        1 && " - "}
                                    </p>
                                  )
                                )}
                              </div>
                            ))}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="total line">
                      <p>Tổng giá:</p>
                      <p>{formatNumberWithCommas(item.totalPrice)} VNĐ</p>
                    </div>
                    <div className="total line">
                      <p>Trạng thái:</p>
                      <p>{item.status}</p>
                    </div>
                    <div>
                      {
                        item.status === "completed" && !item.isRated && (
                          <div>
                            <div className="total line">
                              <Rating
                                onClick={handleRating}
                              />
                            </div>
                            <div className="total line">
                              <textarea placeholder="..." rows={3} style={{ width: "100%", padding: "10px" }} name="comment" id="" onChange={(e) => setComment(e.target.value)}>
                              </textarea>
                            </div>
                            <div>
                              {photos[item._id] ? photos[item._id].map((photo, index) => (
                                <img
                                  key={index}
                                  src={photo}
                                  alt={index}
                                />
                              )) :
                                <label htmlFor={`photos-${item._id}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                  <img
                                    src={"https://www.pngfind.com/pngs/m/66-661092_png-file-upload-image-icon-png-transparent-png.png"}
                                    alt=""
                                  />
                                </label>}
                              <input
                                type="file"
                                name={`photos-${item._id}`}
                                id={`photos-${item._id}`}
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageChange(e, item._id)}
                              />
                            </div>
                            <button onClick={() => handleReview(item.hotel._id, item._id)} className="buy__btn auth__btn w-100">Đánh giá</button>
                          </div>
                        )
                      }
                    </div>
                  </div>
                );
              })}{" "}
            <div className="right">
              <button className="buy__btn auth__btn w-100">
                <Link to="/hotels">Tiếp tục đặt phòng</Link>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookingList;
