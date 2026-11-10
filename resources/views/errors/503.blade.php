@extends('errors.layout')

@section('kode', '503')
@section('judul', 'Layanan Tidak Tersedia')
@section('pesan', ($pesan ?? null)
    ?: 'Server tidak dapat terhubung ke basis data. Layanan mungkin sedang dimulai ulang atau database sedang tidak tersedia. Silakan coba beberapa saat lagi.')
