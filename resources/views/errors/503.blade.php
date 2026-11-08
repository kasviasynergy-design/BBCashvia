@extends('errors.layout')

@section('kode', '503')
@section('judul', 'Layanan Tidak Tersedia')
@section('pesan', ($pesan ?? null)
    ?: 'Basis data tidak dapat dihubungi. Kemungkinan layanan MySQL belum berjalan. Coba lagi beberapa saat.')
