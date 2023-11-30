<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pedidosapp";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$idCliente = $_GET['idCliente'];

$sql = "SELECT * FROM direcciones WHERE cliente_id = '$idCliente'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $cliente = $result->fetch_assoc();
    echo json_encode($cliente);
} else {
    echo "Cliente no encontrado";
}

$conn->close();
?>
