exports.userFormatTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Thông tin tài khoản</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
            max-width: 500px;
            padding: 20px;
            text-align: center;
        }
        h1 {
            color: #ff00cc;
            font-size: 24px;
        }
        p {
            color: #555;
            font-size: 16px;
            margin-bottom: 20px;
        }
        .bold {
            font-weight: bold;
        }
        .copy-icon {
            font-size: 20px;
            color: #0073e6;
            cursor: pointer;
            margin-left: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Xin chào, $fullName</h1>
        <p>Dưới đây là thông tin tài khoản của bạn để đăng nhập vào ứng dụng SHOOL MANAGER:</p>
        <p class="bold">Mã số sinh viên (MSSV): $mssv <span class="copy-icon" onclick="copyText($mssv)">&#x1F4CB</span></p>
        <p class="bold">Mật khẩu: $password <span class="copy-icon" onclick="copyText($password)">&#x1F4CB</span></p>
        <p>Vui lòng giữ thông tin này cẩn thận và thay đổi mật khẩu sau khi đăng nhập.</p>
    </div>
    <script>
        function copyText(text) {
            const tempInput = document.createElement('input');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('Text copied: ' + text);
        }
    </script>
</body>
</html>          
`;