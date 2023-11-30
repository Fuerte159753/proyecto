<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Verificar si se envió un cliente_id
if (isset($_GET['cliente_id'])) {
    $clienteId = $_GET['cliente_id'];

    // Conectar a la base de datos
    $conn = new mysqli('localhost', 'root', '', 'pedidosapp');

    // Verificar la conexión
    if ($conn->connect_error) {
        die("Error en la conexión: " . $conn->connect_error);
    }

    // Consulta para obtener las direcciones del cliente
    $sql = "SELECT id_dire, direccion FROM direcciones WHERE cliente_id = $clienteId";

    // Ejecutar la consulta
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $direcciones = array();
        while ($row = $result->fetch_assoc()) {
            $direcciones[] = $row;
        }
        echo json_encode($direcciones); // Enviar las direcciones como JSON
    } else {
        echo "No se encontraron direcciones para el cliente con ID: $clienteId";
    }

    $conn->close();
} else {
    echo "No se proporcionó un cliente_id.";
}
?>