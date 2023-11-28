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

    $sqlRepartidores = "SELECT * FROM repartidores WHERE correo = '$correo'";
    $sqlClientes = "SELECT * FROM clientes WHERE correo = '$correo'";

    $resultRepartidores = $conn->query($sqlRepartidores);
    $resultClientes = $conn->query($sqlClientes);

    if ($resultRepartidores->num_rows > 0) {
        $row = $resultRepartidores->fetch_assoc();
        // Usuario encontrado en la tabla de repartidores
        if ($row["password"] === $password) {
            echo json_encode(array("message" => "Inicio de sesión exitoso", "Tipeuser" => 0, "id" => $row["repartidor_id"]));
        } else {
            echo json_encode(array("message" => "Verifica tus datos"));
        }
    } elseif ($resultClientes->num_rows > 0) {
        $row = $resultClientes->fetch_assoc();
        // Usuario encontrado en la tabla de clientes
        if ($row["password"] === $password) {
            echo json_encode(array("message" => "Inicio de sesión exitoso", "Tipeuser" => 1, "id" => $row["cliente_id"]));
        } else {
            echo json_encode(array("message" => "Verifica tus datos"));
        }
    } else {
        // Usuario no encontrado en ninguna tabla
        echo json_encode(array("message" => "Usuario no encontrado"));
    }
}

$conn->close();
?>
