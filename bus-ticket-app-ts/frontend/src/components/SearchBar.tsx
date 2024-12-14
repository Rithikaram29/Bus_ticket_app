import React, { useState } from "react";
import "./style/searchBar.css";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import SeatGrid from "../utils/seatGrid";

const SearchBar: React.FC = () => {
  const today: string = new Date().toISOString().split("T")[0]; // Ensures the type is string
  const [inputdata, setInputData] = useState({
    from: "",
    to: "",
    date: today,
  });

  const [searchResults, setSearchResults] = useState<any>(null); // State to store search results or error
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData({ ...inputdata, [name]: value });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert `from` and `to` values to lowercase
    const processedData = {
      ...inputdata,
      from: inputdata.from.toLowerCase(),
      to: inputdata.to.toLowerCase(),
    };

    try {
      const response = await axios.get("http://localhost:4000/user/findbus", {
        params: processedData, // Send processed data as query parameters
      });

      console.log(response.data);
      setSearchResults(response.data); // Update results on success
    } catch (error: any) {
      console.error("Error fetching bus details:", error);
      setSearchResults({ error: "Failed to fetch bus details." }); // Update error message
    }
  };

  const changeLocation = (e: React.FormEvent) => {
    e.preventDefault();
    setInputData({
      ...inputdata,
      from: inputdata.to,
      to: inputdata.from,
    });
  };

  // Updated openSeat function to include busNo
  const openSeat = (bus: any, currentTrip: any) => {
    setSelectedTrip([bus, currentTrip]);
    setShowPopup(true);
  };

  return (
    <>
      <div>
        <form className="mainform">
          <div>
            <label>From</label>
            <input
              name="from"
              placeholder="From"
              value={inputdata.from}
              onChange={handleChange}
            />
          </div>
          <button onClick={changeLocation} className="swap">
            <FontAwesomeIcon icon={faRightLeft} />
          </button>
          <div>
            <label>To</label>
            <input
              name="to"
              placeholder="To"
              value={inputdata.to}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Date</label>
            <input
              name="date"
              type="date"
              value={inputdata.date}
              onChange={handleChange}
            />
          </div>
          <button onClick={handleSearch} className="search mr-4">
            Search Buses
          </button>
        </form>
        {searchResults && (
          <div className="results">
            {searchResults.error ? (
              <p className="error">{searchResults.error}</p>
            ) : (
              <ul>
                {searchResults.map((bus: any, index: number) => (
                  <div key={index} className="buscard">
                    <li>{bus.busNo}</li>{" "}
                    <div>
                      {bus.trips.length > 0
                        ? bus.trips.map((trip: any, tripIndex: number) => {
                            const tripDate = new Date(trip.pickupDateTime)
                              .toISOString()
                              .split("T")[0];
                            if (
                              trip.pickuplocation.toLowerCase() ===
                                inputdata.from.toLowerCase() &&
                              trip.dropLocation.toLowerCase() ===
                                inputdata.to.toLowerCase() &&
                              tripDate === inputdata.date
                            ) {
                              return (
                                <div key={tripIndex}>
                                  <p>
                                    {trip.pickuplocation} to {trip.dropLocation}
                                  </p>
                                  <p>
                                    {trip.pickupDateTime} to {trip.dropDateTime}
                                  </p>
                                  <button
                                    name={bus}
                                    onClick={() => {
                                      openSeat(bus, trip);
                                      console.log(selectedTrip);
                                    }}
                                  >
                                    Seats
                                  </button>
                                </div>
                              );
                            }
                            return null;
                          })
                        : null}
                    </div>
                  </div>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {showPopup && selectedTrip && (
        <div className="popup">
          {selectedTrip[0].seats ? <SeatGrid seatData={{date: inputdata.date,busno:selectedTrip[0].busNo,...selectedTrip[0].seats,...selectedTrip[1] }}/> : null}
          <button onClick={()=>setShowPopup(false)}>HIDE SEATS</button>
        </div>
      )}
    </>
  );
}; 

export default SearchBar;
