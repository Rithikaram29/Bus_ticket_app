import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { LocalHost } from "../constants";

const LocalHost = "http://localhost:4000";

import "../style/adminbus.css";

interface BookedSeat {
  SeatNumber: string;
  assignedTo: string;
  bookedBy: {
    _id: string;
    userName?: string;
    email?: string;
    name?: string;
  };
}

interface Trip {
  pickuplocation: string;
  pickupDateTime: string;
  dropLocation: string;
  dropDateTime: string;
  bookedSeats: BookedSeat[];
}

interface SeatsStructure {
  noOfSeatsInRowLeft: number;
  noOfSeatsInRowRight: number;
  noOfRowsInTotal: number;
  noOfSeatsInLastRow: number;
}

interface Bus {
  _id: string;
  busNo: string;
  busName: string;
  isAc: boolean;
  seats: SeatsStructure;
  trips: Trip[];
}

interface InputTrip {
  pickuplocation: string;
  pickupDateTime: string;
  dropLocation: string;
  dropDateTime: string;
}

const AdminBus: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]); // Use Bus type for buses
  const [busDetail, setBusDetail] = useState<Bus | null>(null); // Use Bus or null for busDetail
  const navigate = useNavigate();
  const [newTrips, setNewTrips] = useState<InputTrip[]>([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await axios.get(`${LocalHost}/admin/bus`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        setBuses(res.data);
      } catch (error: any) {
        console.log("Error fetching buses:", error.message);
      }
    };

    fetchBuses();
  }, []);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const busId = e.currentTarget.name;
    try {
      const res = await axios.get(`${LocalHost}/admin/bus/details/${busId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setBusDetail(res.data[0]);
    } catch (error) {
      console.log("Error getting bus details:", error);
    }
  };

  const handleNewTripChange = (index: number, key: keyof Trip, value: string) => {
    setNewTrips((prev) => {
      const updatedTrips: any = [...prev];
      updatedTrips[index][key] = value;
      return updatedTrips;
    });
  };

  const handleAddTripInput = () => {
    setNewTrips((prev) => [
      ...prev,
      { pickuplocation: "", pickupDateTime: "", dropLocation: "", dropDateTime: "" },
    ]);
  };

  const resetSeats = (tripIndex: number) => {
    if (!busDetail) return;

    // Update the `bookedSeats` array for the specified trip
    setBusDetail((prev) => {
      if (!prev) return null;

      const updatedTrips = [...prev.trips];
      updatedTrips[tripIndex].bookedSeats = []; // Reset bookedSeats to an empty array
      return { ...prev, trips: updatedTrips };
    });
  };

  const handleUpdateBus = async () => {
    if (!busDetail) {
      alert("No bus selected!");
      return;
    }

    try {
      // Merge the existing trips with new trips
      const updatedBusData = {
        ...busDetail,
        trips: [...busDetail.trips, ...newTrips],
      };

      // Make the PUT request to update the bus
      const response = await axios.put(
        `${LocalHost}/admin/bus/add-trip/${busDetail.busNo}`,
        updatedBusData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the local state with the updated bus data
        setBusDetail(response.data.bus);
        setNewTrips([]); // Clear new trips state
        alert(response.data.message); // Display success message
      } else {
        alert("Failed to update the bus!");
      }
    } catch (error: any) {
      console.error("Error updating the bus:", error.message);
      alert("An error occurred while updating the bus.");
    }
  };
  

  return (
    <div className="maindiv">
      <div className="buslist">
        <button onClick={() => navigate("/admin/addbus")} className="busButton">
          Add Bus
        </button>
        <div>
          <h1 className="font-bold text-lg">Your Buses</h1>
          <div className="busnames">
            {buses.length > 0 ? (
              buses.map((bus: Bus) => (
                <button
                  key={bus._id}
                  name={bus._id}
                  onClick={handleClick}
                  className="busname"
                >
                  {bus.busNo}
                </button>
              ))
            ) : (
              <p>No buses present in your account</p>
            )}
          </div>
        </div>
      </div>
  
      <div className="busDetail">
        {busDetail === null ? (
          <p>Select a bus to display details</p>
        ) : (
          <>
            <h2>{busDetail.busNo}</h2>
            <p>{busDetail.busName}</p>
            <p>{busDetail.isAc ? "AC Bus" : "Non-AC Bus"}</p>
            {busDetail.trips.length > 0 ? (
              busDetail.trips.map((trip: any, index) => (
                <div key={index}>
                  <h3>Trip {index + 1}</h3>
                  <p>
                    <strong>Pickup:</strong> {trip.pickuplocation},{" "}
                    <strong>Time:</strong> {trip.pickupDateTime}
                  </p>
                  <p>
                    <strong>Dropoff:</strong> {trip.dropLocation},{" "}
                    <strong>Time:</strong> {trip.dropDateTime}
                  </p>
                  {trip.bookedSeats.length > 0 && (
                    <div>
                      {trip.bookedSeats.map((seat: any, seatIn: number) => (
                        <div key={seatIn}>
                          <p>SeatNo: {seat.SeatNumber}</p>
                          <p>Name: {seat.assignedTo}</p>
                        </div>
                      ))}
                      <button
                        onClick={() => resetSeats(index)}
                        className="bg-slate-800 text-white rounded-md p-2 mt-2"
                      >
                        Reset Seats
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No trips found</p>
            )}
  
            {newTrips.map((trip, index) => (
              <div key={index} className="w-96">
                <h4>New Trip {index + 1}</h4>
                <label>
                  Pickup Location:
                  <input
                    type="text"
                    value={trip.pickuplocation}
                    onChange={(e) =>
                      handleNewTripChange(index, "pickuplocation", e.target.value)
                    }
                    placeholder="Pickup Location"
                    className="outline-gray-600"
                  />
                </label>
                <label>
                  Pickup Date and Time:
                  <input
                    type="datetime-local"
                    value={trip.pickupDateTime}
                    onChange={(e) =>
                      handleNewTripChange(index, "pickupDateTime", e.target.value)
                    }
                    className="outline-gray-600"
                  />
                </label>
                <label>
                  Drop Location:
                  <input
                    type="text"
                    value={trip.dropLocation}
                    onChange={(e) =>
                      handleNewTripChange(index, "dropLocation", e.target.value)
                    }
                    placeholder="Drop Location"
                    className="outline-gray-600"
                  />
                </label>
                <label>
                  Drop Date and Time:
                  <input
                    type="datetime-local"
                    value={trip.dropDateTime}
                    onChange={(e) =>
                      handleNewTripChange(index, "dropDateTime", e.target.value)
                    }
                    className="outline-gray-600"
                  />
                </label>
              </div>
            ))}
            <button
              className="text-gray-500 rounded-md p-2 mt-2 shadow-md"
              onClick={handleAddTripInput}
            >
              Add Another Trip
            </button>
            <button
              className="text-gray-500 rounded-md p-2 mt-2 shadow-md"
              onClick={handleUpdateBus}
            >
              Update Bus
            </button>
          </>
        )}
      </div>
    </div>
  );
  
};

export default AdminBus;
