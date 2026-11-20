<?php
// Contact form endpoint for Hostinger (replaces the Next.js /api/contact route).
// Set LEAD_EMAIL to the inbox that should receive leads.
const LEAD_EMAIL = 'info@example.com';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?: [];
$f = fn($k) => trim(strip_tags((string)($data[$k] ?? '')));
$name = $f('name'); $email = $f('email'); $phone = $f('phone');

if ($name === '' || $email === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email, and phone number are required.']);
    exit;
}

$lead = [
    'receivedAt' => date('c'), 'name' => $name, 'email' => $email, 'phone' => $phone,
    'company' => $f('company'), 'platform' => $f('platform'),
    'budget' => $f('budget'), 'message' => $f('message'),
];

// Keep a copy on the server (folder is blocked from web access by .htaccess).
$dir = __DIR__ . '/leads';
if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
@file_put_contents("$dir/leads.jsonl", json_encode($lead) . "\n", FILE_APPEND | LOCK_EX);

// Email the lead.
$body = '';
foreach ($lead as $k => $v) { $body .= ucfirst($k) . ": $v\n"; }
$host = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
$headers = "From: VMPL Website <no-reply@$host>\r\n";
if (filter_var($email, FILTER_VALIDATE_EMAIL)) { $headers .= "Reply-To: $email\r\n"; }
@mail(LEAD_EMAIL, "New VMPL lead: $name", $body, $headers);

echo json_encode(['success' => true, 'message' => 'Inquiry received successfully.']);
