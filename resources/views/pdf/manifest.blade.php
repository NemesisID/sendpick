<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manifest - {{ $manifest->manifest_id }}</title>
    <style>
        /* Reset dan Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
            background: #fff;
        }

        /* Container */
        .container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            padding: 12mm;
        }

        /* Header Section */
        .header {
            width: 100%;
            border-bottom: 3px solid #059669;
            padding-bottom: 12px;
            margin-bottom: 15px;
        }

        .header-table {
            width: 100%;
        }

        .company-info {
            text-align: left;
        }

        .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 5px;
        }

        .company-address {
            font-size: 9px;
            color: #666;
        }

        .doc-info {
            text-align: right;
        }

        .doc-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .doc-subtitle {
            font-size: 10px;
            color: #666;
            margin-bottom: 5px;
        }

        .doc-number {
            font-size: 13px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 5px;
        }

        .doc-date {
            font-size: 9px;
            color: #666;
        }

        /* Status Badge */
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-pending { background: #FEF3C7; color: #D97706; }
        .status-in-transit { background: #DBEAFE; color: #2563EB; }
        .status-arrived { background: #E0E7FF; color: #4F46E5; }
        .status-completed { background: #D1FAE5; color: #059669; }
        .status-cancelled { background: #FEE2E2; color: #DC2626; }

        /* Info Sections */
        .info-section {
            margin-bottom: 15px;
        }

        .section-title {
            font-size: 11px;
            font-weight: bold;
            color: #059669;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 4px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
        }

        .info-table td {
            padding: 4px 0;
            vertical-align: top;
        }

        .info-label {
            width: 120px;
            font-weight: 600;
            color: #666;
        }

        .info-value {
            color: #333;
        }

        /* Two Column Layout */
        .two-column {
            width: 100%;
        }

        .two-column td {
            width: 50%;
            vertical-align: top;
            padding-right: 12px;
        }

        .two-column td:last-child {
            padding-right: 0;
            padding-left: 12px;
        }

        /* Route Box */
        .route-box {
            background: #ECFDF5;
            border: 1px solid #059669;
            border-radius: 6px;
            padding: 12px;
            margin: 12px 0;
        }

        .route-table {
            width: 100%;
        }

        .route-point {
            width: 45%;
            padding: 8px;
        }

        .route-arrow {
            width: 10%;
            text-align: center;
            vertical-align: middle;
        }

        .route-arrow-icon {
            font-size: 18px;
            color: #059669;
        }

        .route-label {
            font-size: 8px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 3px;
        }

        .route-city {
            font-size: 13px;
            font-weight: bold;
            color: #333;
        }

        /* Job Orders Table */
        .job-orders-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }

        .job-orders-table th {
            background: #059669;
            color: #fff;
            padding: 8px 6px;
            text-align: left;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .job-orders-table td {
            padding: 8px 6px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 9px;
        }

        .job-orders-table tr:nth-child(even) {
            background: #F9FAFB;
        }

        .job-orders-table .text-right {
            text-align: right;
        }

        .job-orders-table .text-center {
            text-align: center;
        }

        /* Total Row */
        .total-row {
            background: #ECFDF5 !important;
            font-weight: bold;
        }

        .total-row td {
            border-top: 2px solid #059669;
            padding: 10px 6px;
        }

        /* Summary Box */
        .summary-box {
            background: #F3F4F6;
            border-radius: 6px;
            padding: 12px;
            margin-top: 15px;
        }

        .summary-table {
            width: 100%;
        }

        .summary-item {
            text-align: center;
            padding: 8px;
        }

        .summary-value {
            font-size: 16px;
            font-weight: bold;
            color: #059669;
        }

        .summary-label {
            font-size: 8px;
            color: #666;
            text-transform: uppercase;
        }

        /* Signature Section */
        .signature-section {
            margin-top: 30px;
            page-break-inside: avoid;
        }

        .signature-table {
            width: 100%;
        }

        .signature-box {
            width: 33%;
            text-align: center;
            padding: 8px;
        }

        .signature-title {
            font-size: 9px;
            font-weight: 600;
            color: #333;
            margin-bottom: 50px;
        }

        .signature-line {
            border-top: 1px solid #333;
            width: 80%;
            margin: 0 auto;
        }

        .signature-name {
            font-size: 9px;
            color: #666;
            margin-top: 4px;
        }

        /* Footer */
        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #E5E7EB;
            font-size: 8px;
            color: #999;
            text-align: center;
        }

        /* Print specific styles */
        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
        }

        /* Page break utility */
        .page-break {
            page-break-after: always;
        }

        /* Page break inside prevention */
        .no-break {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <table class="header-table">
                <tr>
                    <td class="company-info">
                        <div class="company-name">{{ $companyName }}</div>
                        <div class="company-address">
                            {{ $companyAddress }}<br>
                            Telp: {{ $companyPhone }}
                        </div>
                    </td>
                    <td class="doc-info">
                        <div class="doc-title">MANIFEST</div>
                        <div class="doc-subtitle">Packing List / Surat Jalan</div>
                        <div class="doc-number">{{ $manifest->manifest_id }}</div>
                        <div class="doc-date">Tanggal: {{ $manifest->created_at ? $manifest->created_at->format('d/m/Y') : '-' }}</div>
                        <div style="margin-top: 6px;">
                            @php
                                $statusClass = 'status-pending';
                                $status = strtolower($manifest->status ?? 'pending');
                                if (str_contains($status, 'transit')) $statusClass = 'status-in-transit';
                                elseif ($status === 'arrived') $statusClass = 'status-arrived';
                                elseif ($status === 'completed') $statusClass = 'status-completed';
                                elseif ($status === 'cancelled') $statusClass = 'status-cancelled';
                            @endphp
                            <span class="status-badge {{ $statusClass }}">{{ $manifest->status ?? 'Pending' }}</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Route Box -->
        <div class="route-box">
            <table class="route-table">
                <tr>
                    <td class="route-point">
                        <div class="route-label">📍 Kota Asal</div>
                        <div class="route-city">{{ $manifest->origin_city ?? '-' }}</div>
                    </td>
                    <td class="route-arrow">
                        <span class="route-arrow-icon">→</span>
                    </td>
                    <td class="route-point">
                        <div class="route-label">📍 Kota Tujuan</div>
                        <div class="route-city">{{ $manifest->dest_city ?? '-' }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Two Column Info -->
        <table class="two-column">
            <tr>
                <!-- Manifest Info -->
                <td>
                    <div class="info-section">
                        <div class="section-title">Informasi Manifest</div>
                        <table class="info-table">
                            <tr>
                                <td class="info-label">Jadwal Berangkat</td>
                                <td class="info-value">: {{ $manifest->planned_departure ? $manifest->planned_departure->format('d/m/Y H:i') : '-' }}</td>
                            </tr>
                            <tr>
                                <td class="info-label">Estimasi Tiba</td>
                                <td class="info-value">: {{ $manifest->planned_arrival ? $manifest->planned_arrival->format('d/m/Y H:i') : '-' }}</td>
                            </tr>
                            <tr>
                                <td class="info-label">Total Job Order</td>
                                <td class="info-value">: {{ count($jobOrders) }} order</td>
                            </tr>
                        </table>
                    </div>
                </td>

                <!-- Driver/Vehicle Info -->
                <td>
                    <div class="info-section">
                        <div class="section-title">Driver & Kendaraan</div>
                        <table class="info-table">
                            <tr>
                                <td class="info-label">Driver</td>
                                <td class="info-value">: {{ $driverName }}</td>
                            </tr>
                            <tr>
                                <td class="info-label">No. HP Driver</td>
                                <td class="info-value">: {{ $driverPhone }}</td>
                            </tr>
                            <tr>
                                <td class="info-label">Kendaraan</td>
                                <td class="info-value">: {{ $vehiclePlate }} {{ $vehicleBrand ? "($vehicleBrand)" : '' }}</td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Job Orders List -->
        <div class="info-section no-break">
            <div class="section-title">Daftar Job Order ({{ count($jobOrders) }} Item)</div>
            <table class="job-orders-table">
                <thead>
                    <tr>
                        <th style="width: 4%;">No</th>
                        <th style="width: 14%;">Job Order ID</th>
                        <th style="width: 20%;">Customer</th>
                        <th style="width: 12%;">Asal</th>
                        <th style="width: 12%;">Tujuan</th>
                        <th style="width: 18%;">Deskripsi Barang</th>
                        <th style="width: 7%;" class="text-center">Koli</th>
                        <th style="width: 7%;" class="text-right">Kg</th>
                        <th style="width: 6%;" class="text-right">m³</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($jobOrders as $jo)
                    <tr>
                        <td class="text-center">{{ $jo['no'] }}</td>
                        <td>{{ $jo['job_order_id'] }}</td>
                        <td>{{ Str::limit($jo['customer_name'], 20) }}</td>
                        <td>{{ $jo['pickup_city'] }}</td>
                        <td>{{ $jo['delivery_city'] }}</td>
                        <td>{{ Str::limit($jo['goods_desc'], 25) }}</td>
                        <td class="text-center">{{ $jo['goods_qty'] }}</td>
                        <td class="text-right">{{ number_format($jo['goods_weight'], 1) }}</td>
                        <td class="text-right">{{ $jo['goods_volume'] > 0 ? number_format($jo['goods_volume'], 2) : '-' }}</td>
                    </tr>
                    @endforeach
                    
                    <!-- Total Row -->
                    <tr class="total-row">
                        <td colspan="6" class="text-right" style="font-weight: bold;">TOTAL</td>
                        <td class="text-center" style="font-weight: bold;">{{ $totalKoli }}</td>
                        <td class="text-right" style="font-weight: bold;">{{ number_format($totalWeight, 1) }}</td>
                        <td class="text-right" style="font-weight: bold;">{{ $totalVolume > 0 ? number_format($totalVolume, 2) : '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Summary Box -->
        <div class="summary-box">
            <table class="summary-table">
                <tr>
                    <td class="summary-item">
                        <div class="summary-value">{{ count($jobOrders) }}</div>
                        <div class="summary-label">Total Job Order</div>
                    </td>
                    <td class="summary-item">
                        <div class="summary-value">{{ $totalKoli }}</div>
                        <div class="summary-label">Total Koli</div>
                    </td>
                    <td class="summary-item">
                        <div class="summary-value">{{ number_format($totalWeight, 1) }} Kg</div>
                        <div class="summary-label">Total Berat</div>
                    </td>
                    <td class="summary-item">
                        <div class="summary-value">{{ $totalVolume > 0 ? number_format($totalVolume, 2) . ' m³' : '-' }}</div>
                        <div class="summary-label">Total Volume</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Notes from Cargo Summary -->
        @if($manifest->cargo_summary)
        <div class="info-section" style="margin-top: 15px;">
            <div class="section-title">Ringkasan Muatan</div>
            <p style="padding: 8px; background: #F9FAFB; border-radius: 5px; font-size: 9px;">
                {{ $manifest->cargo_summary }}
            </p>
        </div>
        @endif

        <!-- Signature Section -->
        <div class="signature-section">
            <table class="signature-table">
                <tr>
                    <td class="signature-box">
                        <div class="signature-title">Petugas Gudang</div>
                        <div class="signature-line"></div>
                        <div class="signature-name">( _________________ )</div>
                    </td>
                    <td class="signature-box">
                        <div class="signature-title">Driver</div>
                        <div class="signature-line"></div>
                        <div class="signature-name">( {{ $driverName !== 'Belum Ditugaskan' ? $driverName : '________________' }} )</div>
                    </td>
                    <td class="signature-box">
                        <div class="signature-title">Penerima</div>
                        <div class="signature-line"></div>
                        <div class="signature-name">( _________________ )</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Dicetak pada: {{ $printDate }} | {{ $companyName }} - Sistem Manajemen Pengiriman</p>
            <p style="margin-top: 4px;">Dokumen ini sah tanpa tanda tangan basah | Harap periksa kelengkapan barang sebelum berangkat</p>
        </div>
    </div>
</body>
</html>
