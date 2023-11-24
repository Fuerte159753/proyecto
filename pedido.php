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
    die("Conexión fallida: " . $conn->connect_error);
}

$idCliente = $_GET['idCliente'];

$sql = "SELECT direccion FROM direcciones WHERE cliente_id = '$idCliente'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $direcciones = array();
    while ($row = $result->fetch_assoc()) {
        $direcciones[] = $row["direccion"];
    }
    echo json_encode($direcciones);
} else {
    echo json_encode(array("mensaje" => "No se encontraron direcciones para este cliente"));
}

$conn->close();
?>
