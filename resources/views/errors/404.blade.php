@extends('errors.layout')

@section('kode', '404')
@section('judul', 'Halaman Tidak Ditemukan')
@section('pesan', ($pesan ?? null)
    ?: 'Alamat yang Anda tuju tidak ada atau telah dipindahkan. Periksa kembali tautan yang Anda buka.')
