import { Link } from 'react-router-dom';
import type { Room } from '../types';

interface RoomCardProps {
  room: Room;
  showWifi?: boolean;
}

export default function RoomCard({ room, showWifi = false }: RoomCardProps) {
  return (
    <div className="room-card">
      <div className="room-img">
        <img src={room.image} alt={room.name} />
        <div className="room-price">
          ${room.price} <span>/ night</span>
        </div>
        {room.soldOut && <div className="room-badge">Fully Booked</div>}
      </div>
      <div className="room-body">
        <h3>{room.name}</h3>
        <p>{showWifi ? room.description : (room.shortDescription ?? room.description)}</p>
        <div className="room-meta">
          <span><i className="fa-solid fa-user"></i> {room.guests} Guests</span>
          {room.size != null && <span><i className="fa-solid fa-expand"></i> {room.size} m&sup2;</span>}
          {room.bed && <span><i className="fa-solid fa-bed"></i> {room.bed}</span>}
          {showWifi && <span><i className="fa-solid fa-wifi"></i> Free Wi-Fi</span>}
        </div>
        <div className="room-footer">
          <Link to={`/booking?room=${room.id}`} className="room-link">View Details</Link>
          <Link to={`/booking?room=${room.id}`} className="btn btn-dark">Book Now</Link>
        </div>
      </div>
    </div>
  );
}
