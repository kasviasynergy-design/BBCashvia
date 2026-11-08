@extends('errors.layout')

@section('kode', '403')
@section('judul', 'Akses Ditolak')
@section('pesan', ($pesan ?? null)
    ?: 'Anda tidak memiliki hak akses untuk membuka halaman ini. Hubungi Admin bila memerlukan izin akses.')
