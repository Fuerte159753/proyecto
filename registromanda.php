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

    $nombre = $data->nombre;
    $apellido = $data->apellido;
    $direccion = $data->direccion;
    $telefono = $data->telefono;
    $correo = $data->correo;
    $password = $data->password;
    $ruta = $data->rutaSeleccionada;

    // Obtener el último cliente_id registrado
    $query_last_id = "SELECT MAX(cliente_id) AS max_id FROM clientes";
    $result = $conn->query($query_last_id);
    $row = $result->fetch_assoc();
    $last_id = $row['max_id'];
    $next_id = $last_id + 1;

    // Insertar datos en la tabla clientes
    $sql = "INSERT INTO clientes (cliente_id, nombre, apellido, localidad, telefono, correo, password) VALUES ('$next_id', '$nombre','$apellido','$ruta','$telefono','$correo', '$password')";

    if ($conn->query($sql) === TRUE) {
        // Insertar datos en la tabla direcciones
        $sql_direccion = "INSERT INTO direcciones (cliente_id, direccion) VALUES ('$next_id', '$direccion')";
        if ($conn->query($sql_direccion) === TRUE) {
            echo json_encode(array("message" => "Usuario registrado exitosamente"));
        } else {
            echo json_encode(array("message" => "Error al registrar dirección: " . $conn->error));
        }
    } else {
        echo json_encode(array("message" => "Error al registrar usuario: " . $conn->error));
    }
}

$conn->close();
?>
