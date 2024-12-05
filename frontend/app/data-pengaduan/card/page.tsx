// PeminjamanStatusCard.js
"use client";
import React, { useEffect, useState } from "react";

const PengaduanStatusCard = () => {
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    onprogress: 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const pendingResponse = await fetch("http://localhost:5000/api/pengaduan/count/pending");
        const approvedResponse = await fetch("http://localhost:5000/api/pengaduan/count/approved");
        const rejectedResponse = await fetch("http://localhost:5000/api/pengaduan/count/rejected");
        const completedResponse = await fetch("http://localhost:5000/api/pengaduan/count/completed");
        const progressResponse = await fetch("http://localhost:5000/api/pengaduan/count/onprogress");

        const pendingData = await pendingResponse.json();
        const approvedData = await approvedResponse.json();
        const rejectedData = await rejectedResponse.json();
        const completedData = await completedResponse.json();
        const onprogressData = await progressResponse.json();

        // Set data masing-masing sesuai dengan kunci yang tepat
        setStatusCounts({
          pending: pendingData.pendingCount,
          approved: approvedData.approvedCount, // Update kunci sesuai respons API
          rejected: rejectedData.rejectedCount, // Update kunci sesuai respons API
          completed: completedData.completedCount, // Update kunci sesuai respons API
          onprogress: onprogressData.onprogressCount, // Update kunci sesuai respons API
        });
      } catch (error) {
        console.error("Error fetching status counts", error);
      }
    };

    fetchStatusCounts();
  }, []);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, backgroundColor: "#f9c74f" }}>
        <h3>Pending</h3>
        <p style={styles.count}>{statusCounts.pending}</p>
      </div>
      <div style={{ ...styles.card, backgroundColor: "#90be6d" }}>
        <h3>Approved</h3>
        <p style={styles.count}>{statusCounts.approved}</p>
      </div>
      <div style={{ ...styles.card, backgroundColor: "blue" }}>
        <h3>OnProgress</h3>
        <p style={styles.count}>{statusCounts.onprogress}</p>
      </div>
      <div style={{ ...styles.card, backgroundColor: "#f94144" }}>
        <h3>Rejected</h3>
        <p style={styles.count}>{statusCounts.rejected}</p>
      </div>
      <div style={{ ...styles.card, backgroundColor: "#577590" }}>
        <h3>Completed</h3>
        <p style={styles.count}>{statusCounts.completed}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    margin: "20px 100px",
  },
  card: {
    flex: 1,
    textAlign: "center",
    padding: "10px",
    margin: "0 20px",
    borderRadius: "12px",
    color: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
  },
  count: {
    fontSize: "2em",
    fontWeight: "bold",
  },
};

export default PengaduanStatusCard;
