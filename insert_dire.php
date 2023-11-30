<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Obtener los datos del formulario
$data = json_decode(file_get_contents('php://input'), true);

// Datos del formulario
$clienteId = $data['cliente_id']; // Asegúrate de obtener el cliente_id desde tu formulario
$direccion = $data['direccion'];

// Verificar si los datos se recibieron correctamente
if ($clienteId && $direccion) {
    echo "Datos recibidos correctamente en el servidor. Cliente ID: $clienteId, Dirección: $direccion";

    // Conectar a la base de datos
    $conn = new mysqli('localhost', 'root', '', 'pedidosapp');

    // Verificar la conexión
    if ($conn->connect_error) {
        die("Error en la conexión: " . $conn->connect_error);
    }

    // Insertar nueva dirección
    $sql = "INSERT INTO direcciones (cliente_id, direccion) VALUES ('$clienteId', '$direccion')";
    if ($conn->query($sql) === TRUE) {
        echo "Nueva dirección agregada correctamente";
    } else {
        echo "Error al agregar dirección: " . $conn->error;
    }

    $conn->close();
} else {
    echo "No se recibieron datos o están incompletos.";
}
?>
