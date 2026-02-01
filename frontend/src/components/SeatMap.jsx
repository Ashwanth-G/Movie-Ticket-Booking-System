import './SeatMap.css';

const SEAT_STATUS = {
  available: 'available',
  locked: 'locked',
  booked: 'booked',
};

export default function SeatMap({ seats, selectedIds = [], onSelect, disabled = false }) {
  const seatsByRow = (seats || []).reduce((acc, seat) => {
    const row = seat.row || 'A';
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(seatsByRow).sort();
  const isSelected = (id) => selectedIds.includes(id);

  const handleClick = (seat) => {
    if (disabled || seat.status === SEAT_STATUS.booked) return;
    if (seat.status === SEAT_STATUS.locked && !isSelected(seat._id)) return;
    onSelect?.(seat);
  };

  return (
    <div className="seat-map">
      <div className="screen-label">Screen</div>
      {sortedRows.map((row) => (
        <div key={row} className="seat-row">
          <span className="row-label">{row}</span>
          <div className="seats">
            {(seatsByRow[row] || [])
              .sort((a, b) => a.number - b.number)
              .map((seat) => {
                const status = seat.status || SEAT_STATUS.available;
                const selected = isSelected(seat._id);
                const clickable =
                  status === SEAT_STATUS.available ||
                  (status === SEAT_STATUS.locked && selected);
                return (
                  <button
                    key={seat._id}
                    type="button"
                    className={`seat seat-${status} ${selected ? 'seat-selected' : ''} ${
                      !clickable ? 'seat-disabled' : ''
                    }`}
                    onClick={() => handleClick(seat)}
                    disabled={disabled || !clickable}
                    title={`${row}${seat.number} - ${status}`}
                  >
                    {seat.number}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
      <div className="seat-legend">
        <span className="legend-item seat-available">Available</span>
        <span className="legend-item seat-selected">Selected</span>
        <span className="legend-item seat-locked">Locked</span>
        <span className="legend-item seat-booked">Booked</span>
      </div>
    </div>
  );
}
