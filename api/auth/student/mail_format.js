exports.otpTemplate = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset Email</title>
        <style>
            body, h1, p {
                margin: 0;
                padding: 0;
            }
            .card {
                background-color: #F5F9FF;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                margin: 20px auto;
                max-width: fit-content;
                padding: 20px;
                text-align: center;
                margin: auto;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .container {
                margin: auto;
                width: fit-content;
                height: fit-content;
                flex-direction: column;
                align-items: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            h1 {
                color: #ff00cc;
                font-size: 24px;
                margin-bottom: 15px;
            }
            p {
                color: #555;
                font-size: 16px;
                margin-bottom: 20px;
            }
            .code {
                color: #000;
                font-size: 30px;
                font-weight: bold;
                margin: 20px 0;
            }
            .note {
                color: #888;
                font-size: 14px;
                margin-top: 15px;
            }
            .bold {
                color: #000;
                font-weight: bold;
            }
            .icons {
                display: flex;
                justify-content: center;
                margin-top: 30px;
            }
            .icon {
                font-size: 24px;
                margin: 0 10px;
                color: #333;
            }

            .style-size18-weight500{
                color: var(--Usage-Text-title, #373743); 
                text-align: center; 
                font-family: 'Be Vietnam Pro'; 
                font-size: 18px; 
                font-weight: 500;
                line-height: 140%;
                gap: 32px;
            }

            .content {
                background-color: white;
                padding: 10px 20px;
                gap: 12px;
                height: fit-content;
                border-radius: 8px;
                border: 1px solid #d2d5da;
                margin-bottom: 32px;
                text-align: left; 
            }
    
            .content h2 {
                margin: 0;
                margin-bottom: 16px;
                font-size: 18px;
                font-weight: 700;
            }
    
            .content p {
                margin: 0;
                color: #656c7b;
                margin-bottom: 12px;
            }
    
            .content b {
                color: black;
            }

            .style-size18-weight700{
                color: var(--Usage-Text-title, #373743);
                font-family: 'Be Vietnam Pro'; 
                font-size: 18px; 
                font-weight: 700; 
                line-height: 140%; 
                text-align: left; 
                align-self: stretch;
            }

            .style-size18-weight700{
                color: var(--Usage-Text-title, #373743);
                font-family: 'Be Vietnam Pro'; 
                font-size: 18px; 
                font-weight: 700; 
                line-height: 140%; 
                text-align: left; 
                align-self: stretch;
            }

            .style-size16-height140{
                color: var(--Color---Lightmode-Neutral-70, #4E535F);
                font-family: Be Vietnam Pro;
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 140%;
                
            }

            .style-weight400{
                color: var(--Color---Lightmode-Neutral-70, #4E535F);
                font-size: 14px;
                font-weight: 400;
            }

            .style-weight600{
                color: var(--Usage-Brand, #5661F5);
                font-family: 'Be Vietnam Pro';
                font-size: 16px;
                font-weight: 800;
            }

            .style-size16-weight600 {
                font-family: 'Be Vietnam Pro'; 
                font-size: 16px; 
                font-weight: 600; 
                line-height: 140%; 
                color: var(--Usage-Text-title, #373743);
            }

            .style-note {
                font-weight: 700;
            }

            .style-size16-weight400 {
                font-family: 'Be Vietnam Pro'; 
                font-size: 16px; 
                font-weight: 400; 
                line-height: 140%; 
                color: var(--Color---Lightmode-Neutral-70, #4E535F);
            }

            .style-size14-weight700 {
                color: var(--Usage-Text-title, #373743); 
                font-family: 'Be Vietnam Pro'; 
                font-size: 14px; 
                font-weight: 700; 
                line-height: 140%;
            }

            .style-size14-weight400{
                color: var(--Usage-Text-title, #373743); 
                font-size: 14px; 
                font-weight: 400; 
                line-height: 140%;
            }

            .connect {
                margin: auto;
                display: flex;
                justify-content: center;
                margin-top: 24px;
            }
    
            .connect a {
                text-decoration: none;
                margin-right: 16px;
            }
    
            .connect img {
                height: 32px;
                width: 106px;
            }

            .social {
                justify-content: center;
                align-items: center;
            }

            .social img {
                width: 198px;
                height: auto;
            }

            .style-width-margin{
                width: fit-content;
                margin: auto;
            }

            .style-width-margin img {
                width: 108.47px;
                height: auto;
            }                        

        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon-container">
                <div class="style-width-margin">
                    <img src="https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/image_email%2Fadmin.png?alt=media&token=1ce9741f-3223-400a-b2bb-7855267cf5d0"
                        height="38.94" alt="ANHBAO">
                </div>
                <h2 class="style-size18-weight500">Bạn đồng hành cùng chúng tôi</h2>
            </div>

            <div class="container">
                <div class="content">
                    <h2 class="style-size18-weight700">Chào bạn,<h4>$email</h4></h2>
                    <p class="style-size16-height140">
                    Chúng tôi đã nhận được yêu cầu thay đổi mật khẩu của quý khách. <br /><br />
                        <span class="style-weight400">Mã xác minh của bạn là:</span>
                        <span class="style-weight600">$otpCode</span>
                    </p>
                    <p class="style-size14-weight400">Vui lòng nhập mã này để đặt lại mật khẩu của bạn</p>
                    <p class="style-size16-weight600">
                        <span class="style-note">Lưu ý:</span>
                        <span class="style-size16-weight400">đường dẫn chỉ có hiệu lực trong vòng $remainingTime phút.</span>
                    </p>
                    <p class="style-size16-weight400">
                        Trân trọng.
                    </p>
                </div>
            </div>
            
            <h2 class="style-size14-weight700">
                KẾT NỐI VỚI CHÚNG TÔI:
            </h2>

            <div class="social">
                <a href="https://school-manager-793a1.web.app/" target="_blank">
                    <img src="https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/image_email%2FSocial_Media_Icons.png?alt=media&token=b2d90bf9-463d-4955-bb56-87b9e2abc11a" alt="Social">
                </a>
            </div>

            <div class="container">
                <div class="connect">
                    <a href="https://school-manager-793a1.web.app/" target="_blank">
                        <img src="https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/image_email%2Fapp%20store.png?alt=media&token=a1362eba-43e2-48ac-8180-cd6800736876" alt="AppStore">
                    </a>
                    <a href="https://school-manager-793a1.web.app/" target="_blank">
                        <img src="https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/image_email%2Fgg%20play.png?alt=media&token=7e1549ee-aa5f-439f-b0af-ef556f774712" alt="Google Play">
                    </a>
                </div>
            </div>

            
        </div>
    </body>
</html>
`;