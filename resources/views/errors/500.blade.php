@extends('errors.layout')

@section('kode', '500')
@section('judul', 'Kesalahan Server Internal')
@section('pesan', ($pesan ?? null)
    ?: 'Sistem mengalami galat tak terduga. Galat ini sudah dicatat dan tim berusaha memulihkan layanan. Coba lagi beberapa saat.')
