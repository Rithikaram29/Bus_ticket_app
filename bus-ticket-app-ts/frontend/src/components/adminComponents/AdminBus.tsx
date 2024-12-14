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

const AdminBus: React.FC = () => {
  const [buses, setBuses] = useState<any>([]);
  const [busDetail, setBusDetail] = useState<Bus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${LocalHost}/admin/bus`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        // Assuming res.data is already an array
        console.log(res.data);
        setBuses(res.data); // Directly set res.data
      } catch (error: any) {
        console.log("Error fetching user:", error.message);
      }
    };

    fetchUser();
    console.log(buses);
  }, []);

  const handleClick = async (e: {
    preventDefault: () => void;
    target: { name: any };
  }) => {
    e.preventDefault();
    console.log(e.target.name);
    try {
      const res = await axios.get(
        `${LocalHost}/admin/bus/details/${e.target.name}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const data = res.data[0];
      console.log(data);
      setBusDetail(data);
    } catch (error) {
      console.log("Error getting bus details:", error);
    }
  };

  return (
    <>
      <button onClick={() => navigate("/admin/addbus")} className="busButton">
        Add bus
      </button>
      <div>
        <h1>Your Buses</h1>
        <div className="busnames">
          {" "}
          {buses.length > 0 ? (
            buses.map((bus: any, index: any) => (
              <button
                key={index}
                name={bus._id}
                onClick={(e: any) => {
                  handleClick(e);
                }}
              >
                {bus.busNo}
              </button>
            ))
          ) : (
            <p>No bus present in your account</p>
          )}
        </div>
      </div>
      <div className="busDetail">
        {busDetail === null ? (
          <p>Select bus to display details</p>
        ) : (
          <>
            <h2>{busDetail.busNo}</h2>
            <p>{busDetail.busName}</p>
            <p>{busDetail.isAc ? "AC Bus" : "non-AC bus"}</p>
          </>
        )}
      </div>
    </>
  );
};

export default AdminBus;
