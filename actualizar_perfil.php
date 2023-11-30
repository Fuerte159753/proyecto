<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$data = json_decode(file_get_contents('php://input'), true);

$clienteId = $data['id'];
$nNombre = $data['nombre'];
$nApellido = $data['apellido'];
$nTelefono = $data['telefono'];
$nPassword = $data['password'];

$conn = new mysqli('localhost', 'root', '', 'pedidosapp');

// Verificar la conexión
if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}

// Actualizar datos del cliente
$sql = "UPDATE clientes SET nombre ='$nNombre', apellido ='$nApellido', telefono ='$nTelefono', password ='$nPassword' WHERE cliente_id = $clienteId";
if ($conn->query($sql) == TRUE) {
    echo "Datos actualizados correctamente";
} else {
    echo "Error al actualizar datos: " . $conn->error;
}
$conn->close();
?>
