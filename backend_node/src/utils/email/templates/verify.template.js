export const verify_templet = ({ otp = "", title = "Confirm Email" } = {}) => {
    return `<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<style type="text/css">
body{background-color:#e6f2ef;margin:0px;}
</style>

<body style="margin:0px;"> 

<table border="0" width="50%" style="margin:auto;padding:30px;background-color:#F3F3F3;border:1px solid #0B3D2E;">

<tr>
<td>
<table border="0" width="100%">
<tr>
<td>
<h1 style="color:#0B3D2E;">
    Smart Football Analyst
</h1>
</td>
<td>
<p style="text-align:right;">
<a href="http://localhost:4200/#/" target="_blank" style="text-decoration:none;color:#0B3D2E;">
View In Website
</a>
</p>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td>
<table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color:#fff;">
<tr>
<td style="background-color:#0B3D2E;height:100px;font-size:50px;color:#fff;">
⚽
</td>
</tr>

<tr>
<td>
<h1 style="padding-top:25px;color:#0B3D2E">${title}</h1>
</td>
</tr>

<tr>
<td>
<p style="padding:0px 100px;">
</p>
</td>
</tr>

<tr>
<td>
<h2 style="
margin:10px 0px 30px 0px;
border-radius:4px;
padding:10px 20px;
border:0;
color:#fff;
background-color:#0B3D2E;
">
${otp}
</h2>
</td>
</tr>

</table>
</td>
</tr>

<tr>
<td>
<table border="0" width="100%" style="border-radius:5px;text-align:center;">
<tr>
<td>
<h3 style="margin-top:10px;color:#000">Stay in touch</h3>
</td>
</tr>

<tr>
<td>
<div style="margin-top:20px;">

<a href="#" style="text-decoration:none;">
<img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="40px">
</a>

<a href="#" style="text-decoration:none;">
<img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="40px">
</a>

<a href="#" style="text-decoration:none;">
<img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="40px">
</a>

</div>
</td>
</tr>

</table>
</td>
</tr>

</table>

</body>
</html>`
}
