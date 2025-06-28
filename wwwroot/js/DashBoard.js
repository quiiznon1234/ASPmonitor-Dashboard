document.addEventListener('DOMContentLoaded', function () {

    //alert('Number 1');

    const cardContainer = document.querySelector('#dashboard-cards');
    const roomID = localStorage.getItem('roomID');
    const sectionTableContainer = document.getElementById('section-table-container');

    if (!roomID) {
        alert('No RoomID found. Please log in again.');
        return;
    }

    //const notificationAudio = document.getElementById("notification-audio");
    //if (!notificationAudio) {
    //    console.log("❌ Audio element not found in the DOM!");
    //}

    //document.addEventListener("click", function () {
    //    if (notificationAudio) {
    //        notificationAudio.play().catch(error => console.warn("⚠ Auto-play blocked:", error));
    //    }
    //}, { once: true });
    const notificationAudio = document.getElementById("notification-audio");

    if (notificationAudio) {
        document.addEventListener("click", () => {
            if (notificationAudio.paused) {
                notificationAudio.play().catch(err => {
                    console.warn("⚠ Auto-play error:", err);
                });
            }
        }, { once: true });
    }

    fetchSectionsByRoomID(roomID);
    fetchSectionSum(roomID);

    function fetchSectionsByRoomID(roomID) {
        var _urlGetRoom = defaultUrl + 'Setting/SectionRooms/' + roomID;

        $.ajax({
            //url: `${window.location.origin}/Setting/SectionRooms/${roomID}`,
            url: _urlGetRoom,
            dataType: 'json',
            success: function (data) {
                if (Array.isArray(data) && data.length > 0) {
                    createCards(data);
                } else {
                    cardContainer.innerHTML = '<p>No sections available for this Dashboard.</p>';
                }
            },
            error: function (xhr, status, error) {
                alert('Failed to fetch section data.');
            }
        });
    }

    function createCards(sections) {
        const cardContainer = document.querySelector('#dashboard-cards');
        cardContainer.innerHTML = '';

        sections.forEach(section => {
            const sectionNameFormatted = section.sectionroomName.replace(/\s+/g, '_');
            const sectionRoomId = section.sectionroomName;

            // สร้าง Card
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.sectionId = sectionRoomId;
            card.dataset.sectionName = section.sectionroomName;

            // ปุ่มลบ Card
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '<i class="bi bi-trash"></i>'; //(🗑️)
            closeButton.classList.add('card-btn');

            closeButton.onclick = async function () {
                if (confirm(`ต้องการลบข้อมูลใน Section "${section.sectionroomName}" หรือไม่?`)) {
                    try {
                        const response = await fetch('api/LAB/DeleteCard', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ sectionName: section.sectionroomName }) // ส่งข้อมูลไปยังเซิร์ฟเวอร์
                        });

                        const result = await response.json();

                        if (response.ok) {
                            alert(`ลบข้อมูลใน Section เรียบร้อย`);
                        } else {
                            alert(`ไม่มีข้อมูลใน Section`);
                        }
                    } catch (error) {
                        console.log('Error:', error);
                        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
                    }
                }
            };

            // ✅ สร้าง div สำหรับ Title
            const titleContainer = document.createElement('div');
            titleContainer.classList.add('card-title-container')

            // ชื่อ Section
            const cardTitle = document.createElement('h3');
            cardTitle.textContent = section.sectionroomName || 'No content';
            cardTitle.classList.add('card-title');

            titleContainer.appendChild(cardTitle);
            card.appendChild(titleContainer);

            const divider = document.createElement('hr');
            divider.classList.add('card-divider');

            //// ✅ สร้าง div สำหรับ Sum
            //const sumContainer = document.createElement('div');
            //sumContainer.classList.add('card-sum-container');

            // Sum
            const cardContent = document.createElement('p');
            cardContent.id = `sum_${sectionNameFormatted}`;
            cardContent.textContent = 'Sum: Loading...';
            cardContent.classList.add('card-sum');

            //sumContainer.appendChild(cardContent);
            //card.appendChild(sumContainer);

            // ใส่ปุ่มและเนื้อหาลงในการ์ด
            card.appendChild(closeButton);
            //card.appendChild(cardTitle); // ชื่อ Section
            card.appendChild(divider);   // เส้น Divider
            card.appendChild(cardContent);

            // คลิก Card เพื่อดูตารางข้อมูล
            card.addEventListener('click', function () {
                showSectionTable(section.sectionroomName);
            });

            // เพิ่ม Card ลงใน container
            cardContainer.appendChild(card);
        });
    }

    function showSectionTable(sectionName) {
        let sectionTableContainer = document.getElementById("section-table-container");
        sectionTableContainer.innerHTML = '';

        $.ajax({
            url: `${window.location.origin}/api/Lab/GetPatientsBS?sectionName=${sectionName}`,
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (!Array.isArray(response) || response.length === 0) {
                    sectionTableContainer.innerHTML = `<p>No data found for ${sectionName}</p>`;
                    return;
                }
                let tableContent = `
                <div class="data-table fade-in">
                    <h3 class="section-header">${sectionName}</h3> <!-- ✅ เพิ่ม class -->
                    <table>
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Bar Code</th>
                                <th>DateTime</th>
                            </tr>
                        </thead>
                        <tbody id="table-body">
                        </tbody>
                    </table>
                </div>
            `;
                sectionTableContainer.innerHTML = tableContent;

                let tableBody = document.getElementById("table-body");

                response.forEach((patient, index) => {
                    let patientName = patient.patientName ?? "N/A";
                    let barcode = patient.barcode ?? "N/A";
                    let dateTime = patient.dateTime ?? "N/A";
                    let dateColor = getDateColor(patient.DateTime);

                    let row = document.createElement("tr");
                    row.classList.add("fade-in-row");
                    row.style.animationDelay = `${index * 50}ms`; // ดีเลย์แต่ละแถว 150ms

                    row.innerHTML = `
                    <td>${patientName}</td>
                    <td>${barcode}</td>
                    <td><span class="date-tag ${dateColor}">${dateTime}</span></td>
                `;

                    setTimeout(() => {
                        tableBody.appendChild(row);
                    }, index * 150);
                });
            },
            error: function () {
                alert('Failed to load patient data.');
            }
        });
    }

    function getDateColor(dateTime) {
        let date = new Date(dateTime);
        let now = new Date();

        let diffInMinutes = (now - date) / (1000 * 60);

        if (diffInMinutes < 30) {
            return 'green';
        } else if (diffInMinutes < 60) {
            return 'yellow';
        } else {
            return 'red';
        }
    }

    /// Sum Show ///
    function fetchSectionSum(roomID) {

        let previousSums = {};
        if (!roomID) {
            console.error("❌ Invalid room ID:", roomID);
            return;
        }

        // ✅ ตั้งค่า Loading ก่อนโหลดข้อมูล
        document.querySelectorAll("[id^='sum_']").forEach(sumElement => {
            sumElement.innerText = "Sum: 0";  // แก้ไขจาก "Loading..." เป็น "0"
        });

        //var _urlGetSectionSum = defaultUrl + 'DashBoard/GetSectionSum?roomID=' + roomID;
        var absolutePath = defaultUrl + 'api/Lab/GetSectionSum?roomID=' + roomID;
        $.ajax({
            //url: `${window.location.origin}/api/Lab/GetSectionSum?roomID=${roomID}`,
            //url: _urlGetSectionSum,
            url: absolutePath,
            type: "GET",
            dataType: "json",
            success: function (response) {
                console.log("✅ Full API Response:", JSON.stringify(response));

                const existingSections = new Set();

                if (!response || !response.sectionSums || !Array.isArray(response.sectionSums)) {
                    updateSumDisplay(0);
                    return;
                }

                response.sectionSums.forEach(section => {
                    const total = section.total || 0;
                    updateSumDisplay(total, section.sectionName);

                    const sectionIdFormatted = section.sectionName.replace(/\s+/g, '_');
                    existingSections.add(sectionIdFormatted);

                    const sumElement = document.getElementById(`sum_${sectionIdFormatted}`);
                    if (sumElement) {
                        const currentTotal = section.total ?? 0;
                        const previousTotal = previousSums[section.sectionName] ?? -1;

                        if (currentTotal !== previousTotal) {
                            console.log(`🔄 Section ${section.sectionName} changed from ${previousTotal} to ${currentTotal}`);
                            sumElement.innerText = `Sum: ${currentTotal}`;
                            previousSums[section.sectionName] = currentTotal;
                        }
                    } else {
                        console.log(`❌ Element not found: sum_${sectionIdFormatted}`);
                    }
                });

                document.querySelectorAll("[id^='sum_']").forEach(sumElement => {
                    const sectionName = sumElement.id.replace("sum_", "");
                    if (!existingSections.has(sectionName)) {
                        if (sumElement.innerText === "Sum: Loading...") {
                            console.warn(`⚠ No data for section: ${sectionName}. Setting to 0.`);
                            sumElement.innerText = "Sum: 0";
                        }
                    }
                });
            },
            error: function () {
                console.log("❌ Failed to fetch section sum. Setting all to 0.");
                document.querySelectorAll("[id^='sum_']").forEach(sumElement => {
                    sumElement.innerText = "Sum: 0";
                });
            }
        });
    }
    setInterval(() => {
        const roomID = localStorage.getItem('roomID');
        if (roomID) {
            fetchSectionSum(roomID);
        }
    }, 5000);
    function updateSumDisplay(total, sectionName = null) {
        // หากมีชื่อ Section เฉพาะเจาะจง
        if (sectionName) {
            const sumElement = document.getElementById(`sum_${sectionName.replace(/\s+/g, '_')}`);
            if (sumElement) {
                sumElement.innerText = `Sum: ${total}`;
            }
        } else {
            // อัปเดตทุก Section
            document.querySelectorAll("[id^='sum_']").forEach(sumElement => {
                sumElement.innerText = `Sum: ${total}`;
            });
        }
    }

    /// Check UP ///
    let previousSectionRecords = {};
    function checkForNewRecords() {
        const roomID = localStorage.getItem('roomID');
        if (!roomID) {
            console.warn("⚠ No RoomID found. Skipping new records check.");
            return;
        }

        const notificationAudio = document.getElementById("notification-audio");

        $.ajax({
            //url: `${window.location.origin}/api/Lab/GetTotalRecords?roomID=${roomID}`,
            url: absolutePath + "api/Lab/GetTotalRecords?roomID=" + roomID,
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (!response.sectionRecords || response.sectionRecords.length === 0) {
                    console.warn("⚠ No records found for this Room.");
                    return;
                }

                let newRecordDetected = false;

                response.sectionRecords.forEach(section => {
                    const sectionName = section.sectionName;
                    const currentTotal = section.totalRecords ?? section.TotalRecords ?? 0;

                    if (previousSectionRecords[sectionName] !== undefined) {
                        if (currentTotal > previousSectionRecords[sectionName]) {
                            newRecordDetected = true;
                            console.log(`🔔 New record detected in section: ${sectionName}`);
                        }
                    }
                    previousSectionRecords[section.sectionName] = currentTotal;
                });

                /// Play Audio ///
                if (newRecordDetected) {
                    fetchSectionSum(roomID);

                    if (!notificationAudio) {
                        console.log("❌ Audio element not found in DOM!");
                        return;
                    }

                    notificationAudio.pause();  // หยุดเสียงก่อน
                    notificationAudio.currentTime = 0;  // รีเซ็ตให้เล่นจากจุดเริ่มต้น
                    notificationAudio.play().then(() => {
                        console.log("🔊 Notification sound played successfully!");
                    }).catch(error => {
                        console.log("❌ Audio playback failed:", error);
                    });
                }
            },
            error: function () {
                console.log("❌ Error checking new records");
            }
        });
    }
    //let previousSectionRecords = {};
    function updateActivities() {
        $.ajax({
            //url: `${window.location.origin}/api/Lab/GetRecentActivities`, // เรียก API
            //url: defaultUrl + 'DashBoard/GetRecentActivities',
            url: absolutePath + "api/Lab/GetRecentActivities",
            type: "GET",
            dataType: "json",
            success: function (response) {
                console.log("✅ Recent Activities:", response);

                const activitiesContainer = document.getElementById("recent-activities");
                if (!activitiesContainer) {
                    console.log("❌ Element #recent-activities not found!");
                    return;
                }

                // ถ้าไม่มีข้อมูล แสดงข้อความว่า "No recent activities."
                if (!Array.isArray(response) || response.length === 0) {
                    activitiesContainer.innerHTML = `<p class="no-activities">No recent activities.</p>`;
                    return;
                }

                let activityHTML = ``;

                response.forEach(activity => {
                    const sectionName = activity.sectionName || "Unknown";
                    const time = activity.time || "N/A";
                    const sampleID = activity.sampleID || "N/A";
                    const patientName = activity.patientName || "N/A";

                    let statusClass = "red-dot"; // ค่าเริ่มต้นเป็นสีแดง
                    if (sectionName.toLowerCase().includes("las")) {
                        statusClass = "blue-dot"; // เปลี่ยนเป็นสีน้ำเงินถ้าเป็น "LAS"
                    }

                    activityHTML += `
                 <div class="timeline-item">
                    <div class="timeline-dot ${statusClass}"></div>
                    <div class="timeline-content">
                        <strong>Time: ${time} <span class="section">${sectionName}</span></strong><br>
                        <p>Sample ID: <b>${sampleID}</b> <br> Name: ${patientName}</p>
                    </div>
                </div>
                `;
                });

                activitiesContainer.innerHTML = activityHTML;
            },
            error: function (xhr) {
                console.log("❌ Failed to load recent activities:", xhr);
            }
        });
    }


    updateActivities();
    setInterval(updateActivities, 5000);
    setInterval(() => {
        checkForNewRecords();
    }, 5000);
});


$(document).ready(function () {
    //$('#settings-button').click(function (event) {
    //    //window.location.href = "/Setting";
    //    $.ajax({
    //        url: defaultUrl + 'Setting/Index',
    //        success: function (response) {               
    //        }
    //    });
    //});

    function initailpage() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        var strDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        $('#current-time').html(strDate);

    }
    
    setInterval(initailpage, 1000);
});