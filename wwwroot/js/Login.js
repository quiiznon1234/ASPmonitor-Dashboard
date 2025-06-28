$(document).ready(function () {
    //var defaultUrl = '@Url.Content("~/")';
    $('#login').click(function (event) {
        event.preventDefault(); // ป้องกันการรีเฟรชหน้า

        let _userName = $('#txtUserName').val().trim();
        let _password = $('#txtPassWord').val().trim();
        let _roomID = $('#dashboard').val();
        let errorMessage = $("#errorMessage");
        //let _url = window.location.origin + "/Login/Login";
      
        // เคลียร์ข้อความแจ้งเตือนก่อน
        errorMessage.addClass("d-none").text("");

        // ✅ **เช็กว่ากรอกข้อมูลครบหรือยัง**
        if (_userName === '' || _password === '') {
            Swal.fire({
                icon: "warning",
                title: "⚠️ กรุณากรอกข้อมูลให้ครบ!",
                text: "โปรดกรอก Username และ Password",
                confirmButtonText: "ตกลง"
            });
            return;
        }
        if (!_roomID || isNaN(_roomID) || _roomID <= 0) {
            Swal.fire({
                icon: "warning",
                title: "⚠️ กรุณาเลือกห้อง!",
                text: "โปรดเลือก Dashboard ก่อนเข้าสู่ระบบ",
                confirmButtonText: "ตกลง"
            });
            return;
        }

        Swal.fire({
            icon: "info",
            title: "🔄 กำลังเข้าสู่ระบบ...",
            text: "กรุณารอสักครู่",
            showConfirmButton: false,
            allowOutsideClick: false,
        });

        // ✅ **ส่งข้อมูลไปที่ API Login**
        $.ajax({
            url: loginUrl,
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: {
                username: _userName,
                password: _password,
                roomID: _roomID
            },
            success: function (response) {
                console.log("API Response:", response); // Debug API

                if (response.status === "success") {
                    Swal.fire({
                        icon: "success",
                        title: "✅ เข้าสู่ระบบสำเร็จ!",
                        text: "กำลังพาคุณไปที่ Dashboard...",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // บันทึก RoomID ลง localStorage
                    localStorage.setItem('roomID', _roomID);

                    setTimeout(() => {
                        window.location.href = response.redirectUrl || "/dashboard";
                    }, 1500);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "❌ เข้าสู่ระบบล้มเหลว!",
                        text: response.message || "กรุณาตรวจสอบข้อมูลและลองใหม่",
                        confirmButtonText: "ตกลง"
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Login Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "❌ เกิดข้อผิดพลาด!",
                    text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
                    confirmButtonText: "ตกลง"
                });
            }
        });
    });

    var GetRoom = function () {
             var cboRoom = $("#dashboard");
        cboRoom.empty();
        cboRoom.append($('<option>').val('').text('Select Dashboard').prop('selected', true));
        $.ajax({
            //url: window.location.origin + "/Login/GetDaashboardroom",
            url:  defaultUrl + "Login/GetDaashboardroom" ,
            dataType: 'json',
            success: function (data, status, xhr) {
                /*var result = data;*/
                if (data !== null && data !== 'undefine' && data.length > 0) {
                    var rooms = data;
                    $.map(rooms, function (item) {
                        $("#dashboard").append($('<option>').val(item.pk).text(item.roomName));
                    });
                    cboRoom.prop('disabled', false);
                } else {
                    alert('No rooms found.');
                }
            }
        });
    }
    GetRoom();
});