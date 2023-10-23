<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
// Otros encabezados para permitir ciertos métodos HTTP y encabezados
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pedidosapp";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));

    $correo = $data->Correo;
    $password = $data->password;

    $sql = "SELECT * FROM usuarios WHERE correo = '$correo' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(array(
            "message" => "Inicio de sesión exitoso",
            "Tipeuser" => $row["Tipeuser"]
        ));
    } else {
        echo json_encode(array("message" => "Credenciales incorrectas"));
    }
}

$conn->close();
?>
