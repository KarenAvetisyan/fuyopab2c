<?php
// Настройки
$to = "fuyopia@ro.ru";  
$from = "info@example.com"; 
$fromName = "Новая заявка Fuyopia"; 

// Поля формы → подписи для письма
$fields = [
    'name'    => 'Имя',
    'email'   => 'Email',
    'phone'   => 'Телефон',
    'message' => 'Сообщение'
];

$message = "Новая заявка с сайта:\r\n\r\n";

// Формирование сообщения
foreach ($fields as $key => $label) {
    if (!empty($_POST[$key])) {
        // Очищаем данные
        $value = htmlspecialchars(trim($_POST[$key]), ENT_QUOTES, 'UTF-8');
        $message .= "$label: $value\r\n\r\n";
    }
}

// Тема письма
$page = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'Сайт';
$subject = "Новая заявка ($page)";
$subject = "=?UTF-8?B?" . base64_encode($subject) . "?=";

// Заголовки
$headers = "From: " . mb_encode_mimeheader($fromName, "UTF-8") . " <$from>\r\n";
$headers .= "Reply-To: $from\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Отправка
if (mail($to, $subject, $message, $headers)) {
    echo "Ваше сообщение отправлено, спасибо!";
} else {
    echo "Ошибка при отправке письма.";
}
?>
