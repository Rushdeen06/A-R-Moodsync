# Fix version-suffixed imports in all UI component files
$files = Get-ChildItem -Path "src\components\ui" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $updated = $content
    
    # Remove all version suffixes from imports
    $updated = $updated -replace '@radix-ui/react-accordion@[\d\.]+', '@radix-ui/react-accordion'
    $updated = $updated -replace '@radix-ui/react-alert-dialog@[\d\.]+', '@radix-ui/react-alert-dialog'
    $updated = $updated -replace '@radix-ui/react-aspect-ratio@[\d\.]+', '@radix-ui/react-aspect-ratio'
    $updated = $updated -replace '@radix-ui/react-avatar@[\d\.]+', '@radix-ui/react-avatar'
    $updated = $updated -replace '@radix-ui/react-checkbox@[\d\.]+', '@radix-ui/react-checkbox'
    $updated = $updated -replace '@radix-ui/react-collapsible@[\d\.]+', '@radix-ui/react-collapsible'
    $updated = $updated -replace '@radix-ui/react-context-menu@[\d\.]+', '@radix-ui/react-context-menu'
    $updated = $updated -replace '@radix-ui/react-dialog@[\d\.]+', '@radix-ui/react-dialog'
    $updated = $updated -replace '@radix-ui/react-dropdown-menu@[\d\.]+', '@radix-ui/react-dropdown-menu'
    $updated = $updated -replace '@radix-ui/react-hover-card@[\d\.]+', '@radix-ui/react-hover-card'
    $updated = $updated -replace '@radix-ui/react-label@[\d\.]+', '@radix-ui/react-label'
    $updated = $updated -replace '@radix-ui/react-menubar@[\d\.]+', '@radix-ui/react-menubar'
    $updated = $updated -replace '@radix-ui/react-navigation-menu@[\d\.]+', '@radix-ui/react-navigation-menu'
    $updated = $updated -replace '@radix-ui/react-popover@[\d\.]+', '@radix-ui/react-popover'
    $updated = $updated -replace '@radix-ui/react-progress@[\d\.]+', '@radix-ui/react-progress'
    $updated = $updated -replace '@radix-ui/react-radio-group@[\d\.]+', '@radix-ui/react-radio-group'
    $updated = $updated -replace '@radix-ui/react-scroll-area@[\d\.]+', '@radix-ui/react-scroll-area'
    $updated = $updated -replace '@radix-ui/react-select@[\d\.]+', '@radix-ui/react-select'
    $updated = $updated -replace '@radix-ui/react-separator@[\d\.]+', '@radix-ui/react-separator'
    $updated = $updated -replace '@radix-ui/react-slider@[\d\.]+', '@radix-ui/react-slider'
    $updated = $updated -replace '@radix-ui/react-slot@[\d\.]+', '@radix-ui/react-slot'
    $updated = $updated -replace '@radix-ui/react-tabs@[\d\.]+', '@radix-ui/react-tabs'
    $updated = $updated -replace '@radix-ui/react-toggle@[\d\.]+', '@radix-ui/react-toggle'
    $updated = $updated -replace '@radix-ui/react-toggle-group@[\d\.]+', '@radix-ui/react-toggle-group'
    $updated = $updated -replace '@radix-ui/react-tooltip@[\d\.]+', '@radix-ui/react-tooltip'
    $updated = $updated -replace 'lucide-react@[\d\.]+', 'lucide-react'
    $updated = $updated -replace 'class-variance-authority@[\d\.]+', 'class-variance-authority'
    $updated = $updated -replace 'react-hook-form@[\d\.]+', 'react-hook-form'
    $updated = $updated -replace 'react-day-picker@[\d\.]+', 'react-day-picker'
    $updated = $updated -replace 'embla-carousel-react@[\d\.]+', 'embla-carousel-react'
    $updated = $updated -replace 'cmdk@[\d\.]+', 'cmdk'
    $updated = $updated -replace 'input-otp@[\d\.]+', 'input-otp'
    $updated = $updated -replace 'vaul@[\d\.]+', 'vaul'
    $updated = $updated -replace 'recharts@[\d\.]+', 'recharts'
    $updated = $updated -replace 'react-resizable-panels@[\d\.]+', 'react-resizable-panels'
    
    if ($content -ne $updated) {
        Set-Content -Path $file.FullName -Value $updated -NoNewline
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nAll version suffixes removed!" -ForegroundColor Cyan
