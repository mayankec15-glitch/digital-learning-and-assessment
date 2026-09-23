import { Question } from '../types';

/**
 * Generates Moodle-compatible GIFT format text.
 * GIFT format can be imported directly into any Moodle question bank (Moodle 3.x to 4.x).
 */
export function exportToMoodleGIFT(questions: Question[]): string {
  let output = '// ========================================================\n';
  output += '// UP ITI Centralized Test Portal - Moodle GIFT Export\n';
  output += `// Generated: ${new Date().toISOString()}\n`;
  output += `// Total Questions: ${questions.length}\n`;
  output += '// ========================================================\n\n';

  questions.forEach((q, idx) => {
    output += `// Question ${idx + 1}: ${q.module} (${q.difficulty})\n`;
    output += `::[${q.tradeId.toUpperCase()}] Q${idx + 1}:: `;
    // Bilingual title
    output += `${q.text.en} / ${q.text.hi} {\n`;
    
    q.options.forEach((opt) => {
      const isCorrect = opt.id === q.correctOption;
      const prefix = isCorrect ? '=' : '~';
      const feedback = isCorrect 
        ? `#Correct! ${q.explanation.en} / ${q.explanation.hi}` 
        : '#Incorrect';
      output += `  ${prefix}${opt.id}) ${opt.text.en} / ${opt.text.hi} ${feedback}\n`;
    });
    
    output += '}\n\n';
  });

  return output;
}

/**
 * Generates Moodle standard XML format for question import.
 */
export function exportToMoodleXML(questions: Question[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<quiz>\n';
  xml += '  <!-- UP ITI Question Bank Export for Moodle -->\n';

  questions.forEach((q, idx) => {
    xml += '  <question type="multichoice">\n';
    xml += `    <name><text>UP ITI ${q.tradeId.toUpperCase()} Q${idx + 1}</text></name>\n`;
    xml += '    <questiontext format="html">\n';
    xml += `      <text><![CDATA[<p><strong>${q.text.en}</strong></p><p><em>${q.text.hi}</em></p>]]></text>\n`;
    xml += '    </questiontext>\n';
    xml += '    <generalfeedback format="html">\n';
    xml += `      <text><![CDATA[<p>${q.explanation.en}</p><p>${q.explanation.hi}</p>]]></text>\n`;
    xml += '    </generalfeedback>\n';
    xml += '    <defaultgrade>1.0000000</defaultgrade>\n';
    xml += '    <penalty>0.3333333</penalty>\n';
    xml += '    <hidden>0</hidden>\n';
    xml += '    <single>true</single>\n';
    xml += '    <shuffleanswers>true</shuffleanswers>\n';
    xml += '    <answernumbering>abc</answernumbering>\n';

    q.options.forEach((opt) => {
      const isCorrect = opt.id === q.correctOption;
      const fraction = isCorrect ? '100' : '0';
      xml += `    <answer fraction="${fraction}" format="html">\n`;
      xml += `      <text><![CDATA[${opt.text.en} / ${opt.text.hi}]]></text>\n`;
      xml += `      <feedback format="html"><text><![CDATA[${isCorrect ? 'Correct!' : 'Incorrect'}]]></text></feedback>\n`;
      xml += '    </answer>\n';
    });

    xml += '  </question>\n';
  });

  xml += '</quiz>';
  return xml;
}

/**
 * Generates Hostinger production Apache .htaccess file for clean client routing,
 * gzip compression, security headers and MIME types.
 */
export function generateHostingerHtaccess(): string {
  return `# =========================================================
# UP ITI Digital Library & CBT Portal - Hostinger Deployment Configuration
# LiteSpeed / Apache Web Server Optimized Configuration
# =========================================================

# 1. Enable URL Rewriting for Single Page Application (SPA)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Redirect HTTP to HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # If requested resource is not an actual file or directory, forward to index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

# 2. GZIP & Brotli Compression for Fast 3G/4G Loading in UP Districts
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# 3. Static Asset Browser Caching (1 Year for Immutable Hashes)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresDefault "access plus 2 days"
</IfModule>

# 4. Security Headers for CBT Exam Protection
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;
}

/**
 * Generates sample PHP 8.2 MySQL API file for Hostinger shared hosting
 * allowing offline-ready test submission and Moodle Gradebook sync.
 */
export function generateHostingerPhpApi(): string {
  return `<?php
/**
 * UP ITI Centralized CBT & Moodle Gradebook Sync API
 * Deployable to Hostinger 'public_html/api/submit_exam.php'
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Hostinger MySQL Database Credentials
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'u123456789_up_iti_db';
$db_user = getenv('DB_USER') ?: 'u123456789_iti_admin';
$db_pass = getenv('DB_PASS') ?: 'YourHostingerPassword';

// 2. Moodle REST Endpoint Settings (Optional)
$moodle_url   = getenv('MOODLE_URL') ?: 'https://lms.up-iti.ac.in';
$moodle_token = getenv('MOODLE_TOKEN') ?: '';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || !isset($data['rollNumber']) || !isset($data['score'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid exam submission payload']);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Insert student result
    $stmt = $pdo->prepare("
        INSERT INTO iti_cbt_results 
        (roll_number, student_name, iti_name, trade_id, score, total_marks, percentage, passed, submitted_at)
        VALUES (:roll, :name, :iti, :trade, :score, :total, :pct, :passed, NOW())
    ");

    $stmt->execute([
        ':roll'   => $data['rollNumber'],
        ':name'   => $data['studentName'],
        ':iti'    => $data['itiName'],
        ':trade'  => $data['tradeName'],
        ':score'  => $data['score'],
        ':total'  => $data['totalMarks'],
        ':pct'    => $data['percentage'],
        ':passed' => $data['passed'] ? 1 : 0,
    ]);

    $insertedId = $pdo->lastInsertId();

    // 3. Optional: Push Grade to Moodle Web Service if token exists
    $moodleSynced = false;
    if (!empty($moodle_token) && !empty($data['moodleUserId'])) {
        $moodleParams = [
            'wstoken' => $moodle_token,
            'wsfunction' => 'core_grades_update_grades',
            'moodlewsrestformat' => 'json',
            'source' => 'up_iti_cbt_portal',
            'courseid' => $data['moodleCourseId'] ?? 1,
            'itemname' => 'CBT_Exam_' . $data['tradeName'],
            'itemnumber' => 0,
            'grades[0][studentid]' => $data['moodleUserId'],
            'grades[0][grade]' => $data['score'],
        ];

        $ch = curl_init($moodle_url . '/webservice/rest/server.php');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($moodleParams));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $moodleResponse = curl_exec($ch);
        curl_close($ch);
        $moodleSynced = true;
    }

    echo json_encode([
        'status' => 'success',
        'result_id' => $insertedId,
        'message' => 'Result stored in Hostinger MySQL successfully',
        'moodle_synced' => $moodleSynced
    ]);

} catch (Exception $e) {
    // If running in development or DB not yet created, return graceful fallback
    echo json_encode([
        'status' => 'mock_saved',
        'message' => 'Submission processed (Hostinger MySQL template active)',
        'error_detail' => $e->getMessage()
    ]);
}
`;
}
