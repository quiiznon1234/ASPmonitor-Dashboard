document.addEventListener("DOMContentLoaded", () => {
    const dashboardTable = document.getElementById("dashboard-table");
    const sectionTableBody = document.getElementById("section-table-body");
    const tableBody = document.querySelector("#dashboard-table tbody");


    $(function () {
        var GetDaashboardroom = function () {
            // URL ของ API (ให้ปรับตามโครงสร้างของระบบ)
            //var url = window.location.origin + "/DashBoard/GetDaashboardroom";
            var url = defaultUrl + 'DashBoard/GetDaashboardroom';
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    // ตรวจสอบว่ามีข้อมูลหรือไม่
                    if (data && data.length > 0) {

                        $("#dashboard-table tbody").empty();

                        $.each(data, function (index, rooms) {
                            const sections = rooms.sections || [];
                            var row = `
                            <tr data-id="${rooms.pk}" data-sections='${JSON.stringify(rooms.sections)}'>
                                <td>${rooms.pk}</td>
                                <td>${rooms.roomName}</td>
                                <td>${rooms.isEnabled ? "Enable" : "Disable"}</td>
                            </tr>
                        `;
                            $("#dashboard-table tbody").append(row);
                        });
                    } else {
                        var emptyRow = `
                        <tr>
                            <td colspan="3">No rooms available</td>
                        </tr>
                    `;
                        $("#dashboard-table tbody").append(emptyRow);
                    }
                },
                error: function (xhr, status, error) {
                    console.log("Failed to load dashboard rooms:", error);
                }
            });
        };
        GetDaashboardroom();
    });

    // Click event for dashboard rows
    tableBody.addEventListener("click", (event) => {
        const row = event.target.closest("tr");

        if (row && row.dataset.sections) {
            selectedDashboardPk = row.dataset.id;
            const sections = row.dataset.sections && row.dataset.sections !== "undefined"
                ? JSON.parse(row.dataset.sections)
                : [];

            $.ajax({
                //url: window.location.origin + "/Setting/sectionrooms",
                url: defaultUrl + 'Setting/sectionrooms',
                data: { "dashboardpk": row.dataset.id },
                dataType: "json",
                success: function (data, status, xhr) {
                    console.log("Data received for sections:", data);

                    drawTable(data);
                },
                error: function (xhr, status, error) {
                    alert("An error occurred while fetching data.");
                    console.log("Error details:", error);
                }
            });

            // Function to draw the table
            function drawTable(data) {
                $('#section').empty();
                let autoId = 1;
                // Check if data is available
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(item => {
                    let row;

                        // Check conditions using if-else
                        if (item.dashboardRoomPk > 0 && item.dashboardRoomPk === 11) {
                            row = $('<tr>')
                                .append($('<td>').text(parseInt(item.dashboardRoomPk, 10) || 'No content'))
                                .append($('<td>').text(item.sectionroomName || 'No content'));
                            $('<button>')
                                .addClass('remove-btn') // คลาสสำหรับระบุปุ่ม Remove
                                .text('Remove')
                                .data('section-id', item.sectionRoomPk)
                        } else if (item.dashboardRoomPk > 0 && item.dashboardRoomPk !== null) {
                            row = $('<tr>')
                                .append($('<td>').text(autoId++)) // ใช้ค่า autoId และเพิ่มค่า (+1)
                                .append($('<td>').text(item.sectionroomName || 'No content'));
                        }
                        $('#section').append(row);
                    });
                }
                window.currentAutoId = autoId;
            }
        }
    });
});

$(function () {
    function updateAutoId() {
        const rows = $("#section tr");
        if (rows.length > 0) {
            autoId = Math.max(...rows.map(function () {
                return parseInt($(this).find("td:first").text(), 10);
            }).get()) + 1;
        } else {
            autoId = 1;
        }
    }

    const modal = $("#sectionModal");
    const addBtn = $("#add-section");
    const closeBtn = $(".close");
    const saveBtn = $("#saveSection");

    let autoId = 1;

    addBtn.on("click", function () {
        modal.show();
    });

    closeBtn.on("click", function () {
        modal.hide();
    });

    saveBtn.on("click", function () {
        const sectionName = $("#sectionNameInput").val();
        if (!selectedDashboardPk) {
            alert("Please select a dashboard first!");
            return;
        }
        if (sectionName.trim() !== "") {
            $.ajax({
                //url: "/Setting/addsectionName",
                url: defaultUrl +'Setting/addsectionName',
                type: "POST",
                data: { name: sectionName, dashboard: selectedDashboardPk },
                success: function (response) {
            updateAutoId();
            const newRow = $("<tr>")
                .append($("<td>").text(autoId++))
                .append($("<td>").text(sectionName));
                    $('<button>')
                        .addClass('remove-btn')
                        .text('Remove')
                        .data('section-id', response.sectionId)

            $("#section").append(newRow);
            $("#sectionNameInput").val("");
                 modal.hide();
                 alert("Add success.");
                },
                error: function (xhr, status, error) {
                    console.error("Error adding section: ", error);
                }
            });
            $("#sectionNameInput").val("");
            modal.hide();
            alert("Add secess.")
        } else {
            alert("Please enter a section name!");
        }
    });

    // ใช้ Event Delegation เพื่อให้แถวทั้งหมดสามารถเลือกได้
    $("#section").on("click", "tr", function () {
        $(this).toggleClass("selected");
        const sectionId = $(this).data("");
        const row = $(this).closest("tr");
            $.ajax({
                //url: "/Setting/removeSection",
                url: defaultUrl + 'Setting/removeSection',
                type: "POST",
                data: { sectionId: sectionId },
                success: function (response) {
                    if (response.success) {
                        row.remove();
                        alert("Section removed successfully.");
                    } else {
                        alert("Failed to remove section. Please try again.");
                    }
                },
                error: function (xhr, status, error) {
                    console.log("Error removing section:", error);
                }
            });
    });

    $("#remove-section").on("click", function () {
        const selectedRows = $("#section tr.selected");
        if (selectedRows.length === 0) {
            alert("Please select at least one section to remove.");
            return;
        }
        var secondColumnData = [];
        $("#section tr.selected").each(function () {
            var text = $(this).find("td:nth-child(2)").text();
            if (text) { // Only add non-empty text
                secondColumnData.push(text);
            }
        });

        if (secondColumnData.length === 0) {
            alert("No rows selected to remove.");
            return;
        }
        if (confirm("Are you sure you want to remove the selected sections?")) {
            $.ajax({
               //url: "/Setting/removeSections",
                url: defaultUrl + 'Setting/removeSections',
                type: "POST",
                contentType: "application/json", // ระบุว่าเป็น JSON
                data: JSON.stringify(secondColumnData),
                success: function (response) {
                    console.log("Server Response:", response);
                    if (response.success) {
                        $("#section tr.selected").remove();
                        alert("Sections removed successfully.");
                    } else {
                        alert("Failed to remove sections. Please try again.");
                    }
                },
                error: function (xhr, status, error) {
                    console.log("Error removing sections:", error);
                    alert("An error occurred while removing the sections.");
                }
            });
        }
    });
});

$(function () {
    const addDashboardButton = $("#add-dashboard");
    const dashboardModal = $("#addDashboardModal");
    const closeDashboardButton = $(".close");
    const saveDashboardButton = $("#saveDashboard");

    // เปิด Modal
    addDashboardButton.on("click", function () {
        console.log("Add button clicked");
        dashboardModal.show();
    });

    // ปิด Modal
    closeDashboardButton.on("click", function () {
        dashboardModal.hide();
    });

    // บันทึก Dashboard Room
    saveDashboardButton.on("click", function () {
        const _dashboardName = $("#roomNameInput").val().trim(); // ดึงค่าจาก Input

        if (_dashboardName.trim() !== "") {
            // ส่งข้อมูลไปที่เซิร์ฟเวอร์
            $.ajax({
                //url: "/Setting/addDashboard", // URL สำหรับ API ที่ต้องเรียก
                url: defaultUrl +'Setting/addDashboard',
                method: "POST",
                //contentType: "application/json",
                data: { dashboardname: _dashboardName }, // ส่งชื่อ Dashboard
                success: function (response) {
                    if (response.success) {
                        const newDashBoardRoomPK = response.DashBoardRoomPK;
                        const newRow = $("<tr>")
                            .append($("<td>").text(newDashBoardRoomPK))
                            .append($("<td>").text(_dashboardName))
                            .append($("<td>").text("Enable"));

                        $("#dashboard-table tbody").append(newRow);
                        $("#roomNameInput").val("");
                        dashboardModal.hide();
                        alert("Dashboard Room added successfully.");
                    } else {
                        alert("Failed to add Dashboard Room: " + response.message);
                    }
                },
                error: function (xhr, status, error) {
                    alert("Error occurred: " + error);
                },
            });
        } else {
            alert("Please enter a valid Dashboard Name.");
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#dashboard-table tbody');

    tableBody.addEventListener('click', function (event) {
        const row = event.target.closest('tr');
        if (row) {
            const roomId = row.querySelector('td:nth-child(1)').innerText;
            const roomName = row.querySelector('td:nth-child(2)').innerText;
            tableBody.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        }
    });
});

$(function () {
    var removeDashboard = function () {
        const selectedRows = $("#dashboard-table tr.selected");

        if (selectedRows.length === 0) {
            alert("Please select at least one dashboard to remove.");
            return;
        }

        const dashboardIds = [];
        selectedRows.each(function () {
            const id = $(this).find("td:nth-child(1)").text();
            if (id) {
                dashboardIds.push(id);
            }
        });

        if (dashboardIds.length === 0) {
            alert("No rows selected to remove.");
            return;
        }

        if (confirm("Are you sure you want to remove the selected dashboards?")) {
            $.ajax({
               // url: "/DashBoard/removeDashboard",
                url: defaultUrl + 'DashBoard/removeDashboard',
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(dashboardIds),
                success: function (response) {
                    console.log("Server Response:", response);
                    if (response.success) {
                        selectedRows.remove();
                        alert("Dashboards removed successfully.");
                    } else {
                        alert("Failed to remove dashboards. Please try again.");
                    }
                },
                error: function (xhr, status, error) {
                    console.log("Error removing dashboards:", error);
                    alert("An error occurred while removing the dashboards.");
                }
            });
        }
    };
    $("#remove-dashboard-row").on("click", removeDashboard);
});