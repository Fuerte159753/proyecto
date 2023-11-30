<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Obtener los datos enviados desde Angular
$data = json_decode(file_get_contents('php://input'), true);

// Datos recibidos desde Angular
$idDireccion = $data['id_dire'];

$conn = new mysqli('localhost', 'root', '', 'pedidosapp');

// Verificar la conexión
if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}

// Eliminar la dirección según su ID
$sql = "DELETE FROM direcciones WHERE id_dire = $idDireccion";

if ($conn->query($sql) === TRUE) {
    echo "Dirección eliminada correctamente";
} else {
    echo "Error al eliminar dirección: " . $conn->error;
}

$conn->close();
?>
