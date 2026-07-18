function Write-FileUtf8($path, $content) {
    [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
}

Write-Host "Helper ready"