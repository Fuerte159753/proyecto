<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pedidosapp";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener el ID del cliente enviado desde la aplicación
$idCliente = $_GET['idCliente']; // Asegúrate de validar y sanitizar esta entrada para evitar SQL Injection

// Consulta para obtener el nombre del cliente usando el ID proporcionado
$sql = "SELECT nombre FROM clientes WHERE cliente_id = '$idCliente'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Si se encontró el cliente, devolver el nombre
    $row = $result->fetch_assoc();
    echo json_encode(array("nombreCliente" => $row["nombre"]));
} else {
    // Si el cliente no se encontró o el ID es incorrecto, devolver un mensaje de error
    echo json_encode(array("error" => "Cliente no encontrado"));
}

$conn->close();
?>
