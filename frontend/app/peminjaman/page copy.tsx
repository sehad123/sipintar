"use client";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import ProsedurPeminjaman from "./list/page";

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_KEY; // Pastikan VAPID key diambil dari env

export default function Home() {
  const [user, setUser] = useState({ name: "", role: "", email: "", id: null }); // State to store user data

  useEffect(() => {
    // Ambil data user dari localStorage saat komponen pertama kali di-mount
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // Set user data from storage
    }

    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.register("../../public/service-worker.js");
          console.log("Service Worker registered with scope:", registration.scope);

          // Langganan push notification
          const subscription = await subscribeUserToPush(registration);

          // Kirim subscription ke backend
          if (subscription && storedUser?.id) {
            await sendSubscriptionToBackend(subscription, storedUser.id); // Kirim subscription dan userId
          }
        } catch (error) {
          console.error("Service Worker registration or push subscription failed:", error);
        }
      }
    };

    registerServiceWorker();
  }, []); // Run only on component mount

  return (
    <>
      <Navbar />
      <ProsedurPeminjaman />
      <Footer />
    </>
  );
}

// Fungsi untuk meminta subscription push notification
async function subscribeUserToPush(registration) {
  try {
    if (!publicVapidKey) {
      throw new Error("Public VAPID key is missing");
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey), // Ubah VAPID key ke dalam format Uint8Array
    });

    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
    return null;
  }
}

// Fungsi untuk mengirim subscription ke backend
async function sendSubscriptionToBackend(subscription, userId) {
  try {
    subscription.userId = userId; // Sertakan userId dalam subscription

    const response = await fetch("http://localhost:5000/api/peminjaman/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error("Failed to send subscription to backend");
    }

    console.log("Subscription sent to backend successfully");
  } catch (error) {
    console.error("Error sending subscription to backend:", error);
  }
}

// Fungsi untuk mengubah VAPID key ke Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
