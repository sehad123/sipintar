// self.addEventListener("push", function (event) {
//   const data = event.data.json();
//   const options = {
//     body: data.message,
//     icon: "📌", // Menggunakan emoji sebagai ikon notifikasi
//     data: {
//       url: "/peminjaman/" + data.peminjamanId, // Link ke halaman detail peminjaman
//     },
//   };

//   event.waitUntil(self.registration.showNotification(data.title, options));
// });

// self.addEventListener("notificationclick", function (event) {
//   event.notification.close();
//   event.waitUntil(clients.openWindow(event.notification.data.url));
// });

self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("Push received:", data);

  const options = {
    body: data.message,
    icon: "📌",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") // Arahkan ke halaman setelah klik notifikasi
  );
});
