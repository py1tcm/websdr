var nbands=5;
var ini_freq=146930.000000;
var ini_mode='fm';
var chseq=2;
var bandinfo= [
  { centerfreq: 3716.000000,
    samplerate: 192.000000,
    tuningstep: 0.031250,
    maxlinbw: 4.000000,
    vfo: 3726.000000,
    maxzoom: 4,
    name: 'SoftRock 80M',
    scaleimgs: [
      ["tmp/1626621414-b0z0i0.png"],
      ["tmp/1626621414-b0z1i0.png","tmp/1626621414-b0z1i1.png"],
      ["tmp/1626621414-b0z2i0.png","tmp/1626621414-b0z2i1.png","tmp/1626621414-b0z2i2.png","tmp/1626621414-b0z2i3.png"],
      ["tmp/1626621414-b0z3i0.png","tmp/1626621414-b0z3i1.png","tmp/1626621414-b0z3i2.png","tmp/1626621414-b0z3i3.png","tmp/1626621414-b0z3i4.png","tmp/1626621414-b0z3i5.png","tmp/1626621414-b0z3i6.png","tmp/1626621414-b0z3i7.png"],
      ["tmp/1626621414-b0z4i0.png","tmp/1626621414-b0z4i1.png","tmp/1626621414-b0z4i2.png","tmp/1626621414-b0z4i3.png","tmp/1626621414-b0z4i4.png","tmp/1626621414-b0z4i5.png","tmp/1626621414-b0z4i6.png","tmp/1626621414-b0z4i7.png","tmp/1626621414-b0z4i8.png","tmp/1626621414-b0z4i9.png","tmp/1626621414-b0z4i10.png","tmp/1626621414-b0z4i11.png","tmp/1626621414-b0z4i12.png","tmp/1626621414-b0z4i13.png","tmp/1626621414-b0z4i14.png","tmp/1626621414-b0z4i15.png"]]
  }
,  { centerfreq: 7080.500000,
    samplerate: 192.000000,
    tuningstep: 0.031250,
    maxlinbw: 4.000000,
    vfo: 7090.500000,
    maxzoom: 4,
    name: 'ZetaSDR 40M',
    scaleimgs: [
      ["tmp/1626621414-b1z0i0.png"],
      ["tmp/1626621414-b1z1i0.png","tmp/1626621414-b1z1i1.png"],
      ["tmp/1626621414-b1z2i0.png","tmp/1626621414-b1z2i1.png","tmp/1626621414-b1z2i2.png","tmp/1626621414-b1z2i3.png"],
      ["tmp/1626621414-b1z3i0.png","tmp/1626621414-b1z3i1.png","tmp/1626621414-b1z3i2.png","tmp/1626621414-b1z3i3.png","tmp/1626621414-b1z3i4.png","tmp/1626621414-b1z3i5.png","tmp/1626621414-b1z3i6.png","tmp/1626621414-b1z3i7.png"],
      ["tmp/1626621414-b1z4i0.png","tmp/1626621414-b1z4i1.png","tmp/1626621414-b1z4i2.png","tmp/1626621414-b1z4i3.png","tmp/1626621414-b1z4i4.png","tmp/1626621414-b1z4i5.png","tmp/1626621414-b1z4i6.png","tmp/1626621414-b1z4i7.png","tmp/1626621414-b1z4i8.png","tmp/1626621414-b1z4i9.png","tmp/1626621414-b1z4i10.png","tmp/1626621414-b1z4i11.png","tmp/1626621414-b1z4i12.png","tmp/1626621414-b1z4i13.png","tmp/1626621414-b1z4i14.png","tmp/1626621414-b1z4i15.png"]]
  }
,  { centerfreq: 14175.000000,
    samplerate: 1024.000000,
    tuningstep: 0.031250,
    maxlinbw: 4.000000,
    vfo: 14185.000000,
    maxzoom: 5,
    name: 'Dongle 20M',
    scaleimgs: [
      ["tmp/1626621414-b2z0i0.png"],
      ["tmp/1626621414-b2z1i0.png","tmp/1626621414-b2z1i1.png"],
      ["tmp/1626621414-b2z2i0.png","tmp/1626621414-b2z2i1.png","tmp/1626621414-b2z2i2.png","tmp/1626621414-b2z2i3.png"],
      ["tmp/1626621414-b2z3i0.png","tmp/1626621414-b2z3i1.png","tmp/1626621414-b2z3i2.png","tmp/1626621414-b2z3i3.png","tmp/1626621414-b2z3i4.png","tmp/1626621414-b2z3i5.png","tmp/1626621414-b2z3i6.png","tmp/1626621414-b2z3i7.png"],
      ["tmp/1626621414-b2z4i0.png","tmp/1626621414-b2z4i1.png","tmp/1626621414-b2z4i2.png","tmp/1626621414-b2z4i3.png","tmp/1626621414-b2z4i4.png","tmp/1626621414-b2z4i5.png","tmp/1626621414-b2z4i6.png","tmp/1626621414-b2z4i7.png","tmp/1626621414-b2z4i8.png","tmp/1626621414-b2z4i9.png","tmp/1626621414-b2z4i10.png","tmp/1626621414-b2z4i11.png","tmp/1626621414-b2z4i12.png","tmp/1626621414-b2z4i13.png","tmp/1626621414-b2z4i14.png","tmp/1626621414-b2z4i15.png"],
      ["tmp/1626621414-b2z5i0.png","tmp/1626621414-b2z5i1.png","tmp/1626621414-b2z5i2.png","tmp/1626621414-b2z5i3.png","tmp/1626621414-b2z5i4.png","tmp/1626621414-b2z5i5.png","tmp/1626621414-b2z5i6.png","tmp/1626621414-b2z5i7.png","tmp/1626621414-b2z5i8.png","tmp/1626621414-b2z5i9.png","tmp/1626621414-b2z5i10.png","tmp/1626621414-b2z5i11.png","tmp/1626621414-b2z5i12.png","tmp/1626621414-b2z5i13.png","tmp/1626621414-b2z5i14.png","tmp/1626621414-b2z5i15.png","tmp/1626621414-b2z5i16.png","tmp/1626621414-b2z5i17.png","tmp/1626621414-b2z5i18.png","tmp/1626621414-b2z5i19.png","tmp/1626621414-b2z5i20.png","tmp/1626621414-b2z5i21.png","tmp/1626621414-b2z5i22.png","tmp/1626621414-b2z5i23.png","tmp/1626621414-b2z5i24.png","tmp/1626621414-b2z5i25.png","tmp/1626621414-b2z5i26.png","tmp/1626621414-b2z5i27.png","tmp/1626621414-b2z5i28.png","tmp/1626621414-b2z5i29.png","tmp/1626621414-b2z5i30.png","tmp/1626621414-b2z5i31.png"]]
  }
,  { centerfreq: 145000.000000,
    samplerate: 2048.000000,
    tuningstep: 0.031250,
    maxlinbw: 4.000000,
    vfo: 145010.000000,
    maxzoom: 6,
    name: '2M-L',
    scaleimgs: [
      ["tmp/1626621414-b3z0i0.png"],
      ["tmp/1626621414-b3z1i0.png","tmp/1626621414-b3z1i1.png"],
      ["tmp/1626621414-b3z2i0.png","tmp/1626621414-b3z2i1.png","tmp/1626621414-b3z2i2.png","tmp/1626621414-b3z2i3.png"],
      ["tmp/1626621414-b3z3i0.png","tmp/1626621414-b3z3i1.png","tmp/1626621414-b3z3i2.png","tmp/1626621414-b3z3i3.png","tmp/1626621414-b3z3i4.png","tmp/1626621414-b3z3i5.png","tmp/1626621414-b3z3i6.png","tmp/1626621414-b3z3i7.png"],
      ["tmp/1626621414-b3z4i0.png","tmp/1626621414-b3z4i1.png","tmp/1626621414-b3z4i2.png","tmp/1626621414-b3z4i3.png","tmp/1626621414-b3z4i4.png","tmp/1626621414-b3z4i5.png","tmp/1626621414-b3z4i6.png","tmp/1626621414-b3z4i7.png","tmp/1626621414-b3z4i8.png","tmp/1626621414-b3z4i9.png","tmp/1626621414-b3z4i10.png","tmp/1626621414-b3z4i11.png","tmp/1626621414-b3z4i12.png","tmp/1626621414-b3z4i13.png","tmp/1626621414-b3z4i14.png","tmp/1626621414-b3z4i15.png"],
      ["tmp/1626621414-b3z5i0.png","tmp/1626621414-b3z5i1.png","tmp/1626621414-b3z5i2.png","tmp/1626621414-b3z5i3.png","tmp/1626621414-b3z5i4.png","tmp/1626621414-b3z5i5.png","tmp/1626621414-b3z5i6.png","tmp/1626621414-b3z5i7.png","tmp/1626621414-b3z5i8.png","tmp/1626621414-b3z5i9.png","tmp/1626621414-b3z5i10.png","tmp/1626621414-b3z5i11.png","tmp/1626621414-b3z5i12.png","tmp/1626621414-b3z5i13.png","tmp/1626621414-b3z5i14.png","tmp/1626621414-b3z5i15.png","tmp/1626621414-b3z5i16.png","tmp/1626621414-b3z5i17.png","tmp/1626621414-b3z5i18.png","tmp/1626621414-b3z5i19.png","tmp/1626621414-b3z5i20.png","tmp/1626621414-b3z5i21.png","tmp/1626621414-b3z5i22.png","tmp/1626621414-b3z5i23.png","tmp/1626621414-b3z5i24.png","tmp/1626621414-b3z5i25.png","tmp/1626621414-b3z5i26.png","tmp/1626621414-b3z5i27.png","tmp/1626621414-b3z5i28.png","tmp/1626621414-b3z5i29.png","tmp/1626621414-b3z5i30.png","tmp/1626621414-b3z5i31.png"],
      ["tmp/1626621414-b3z6i0.png","tmp/1626621414-b3z6i1.png","tmp/1626621414-b3z6i2.png","tmp/1626621414-b3z6i3.png","tmp/1626621414-b3z6i4.png","tmp/1626621414-b3z6i5.png","tmp/1626621414-b3z6i6.png","tmp/1626621414-b3z6i7.png","tmp/1626621414-b3z6i8.png","tmp/1626621414-b3z6i9.png","tmp/1626621414-b3z6i10.png","tmp/1626621414-b3z6i11.png","tmp/1626621414-b3z6i12.png","tmp/1626621414-b3z6i13.png","tmp/1626621414-b3z6i14.png","tmp/1626621414-b3z6i15.png","tmp/1626621414-b3z6i16.png","tmp/1626621414-b3z6i17.png","tmp/1626621414-b3z6i18.png","tmp/1626621414-b3z6i19.png","tmp/1626621414-b3z6i20.png","tmp/1626621414-b3z6i21.png","tmp/1626621414-b3z6i22.png","tmp/1626621414-b3z6i23.png","tmp/1626621414-b3z6i24.png","tmp/1626621414-b3z6i25.png","tmp/1626621414-b3z6i26.png","tmp/1626621414-b3z6i27.png","tmp/1626621414-b3z6i28.png","tmp/1626621414-b3z6i29.png","tmp/1626621414-b3z6i30.png","tmp/1626621414-b3z6i31.png","tmp/1626621414-b3z6i32.png","tmp/1626621414-b3z6i33.png","tmp/1626621414-b3z6i34.png","tmp/1626621414-b3z6i35.png","tmp/1626621414-b3z6i36.png","tmp/1626621414-b3z6i37.png","tmp/1626621414-b3z6i38.png","tmp/1626621414-b3z6i39.png","tmp/1626621414-b3z6i40.png","tmp/1626621414-b3z6i41.png","tmp/1626621414-b3z6i42.png","tmp/1626621414-b3z6i43.png","tmp/1626621414-b3z6i44.png","tmp/1626621414-b3z6i45.png","tmp/1626621414-b3z6i46.png","tmp/1626621414-b3z6i47.png","tmp/1626621414-b3z6i48.png","tmp/1626621414-b3z6i49.png","tmp/1626621414-b3z6i50.png","tmp/1626621414-b3z6i51.png","tmp/1626621414-b3z6i52.png","tmp/1626621414-b3z6i53.png","tmp/1626621414-b3z6i54.png","tmp/1626621414-b3z6i55.png","tmp/1626621414-b3z6i56.png","tmp/1626621414-b3z6i57.png","tmp/1626621414-b3z6i58.png","tmp/1626621414-b3z6i59.png","tmp/1626621414-b3z6i60.png","tmp/1626621414-b3z6i61.png","tmp/1626621414-b3z6i62.png","tmp/1626621414-b3z6i63.png"]]
  }
,  { centerfreq: 147000.000000,
    samplerate: 2048.000000,
    tuningstep: 0.031250,
    maxlinbw: 4.000000,
    vfo: 147010.000000,
    maxzoom: 6,
    name: '2M-H',
    scaleimgs: [
      ["tmp/1626621414-b4z0i0.png"],
      ["tmp/1626621414-b4z1i0.png","tmp/1626621414-b4z1i1.png"],
      ["tmp/1626621414-b4z2i0.png","tmp/1626621414-b4z2i1.png","tmp/1626621414-b4z2i2.png","tmp/1626621414-b4z2i3.png"],
      ["tmp/1626621414-b4z3i0.png","tmp/1626621414-b4z3i1.png","tmp/1626621414-b4z3i2.png","tmp/1626621414-b4z3i3.png","tmp/1626621414-b4z3i4.png","tmp/1626621414-b4z3i5.png","tmp/1626621414-b4z3i6.png","tmp/1626621414-b4z3i7.png"],
      ["tmp/1626621414-b4z4i0.png","tmp/1626621414-b4z4i1.png","tmp/1626621414-b4z4i2.png","tmp/1626621414-b4z4i3.png","tmp/1626621414-b4z4i4.png","tmp/1626621414-b4z4i5.png","tmp/1626621414-b4z4i6.png","tmp/1626621414-b4z4i7.png","tmp/1626621414-b4z4i8.png","tmp/1626621414-b4z4i9.png","tmp/1626621414-b4z4i10.png","tmp/1626621414-b4z4i11.png","tmp/1626621414-b4z4i12.png","tmp/1626621414-b4z4i13.png","tmp/1626621414-b4z4i14.png","tmp/1626621414-b4z4i15.png"],
      ["tmp/1626621414-b4z5i0.png","tmp/1626621414-b4z5i1.png","tmp/1626621414-b4z5i2.png","tmp/1626621414-b4z5i3.png","tmp/1626621414-b4z5i4.png","tmp/1626621414-b4z5i5.png","tmp/1626621414-b4z5i6.png","tmp/1626621414-b4z5i7.png","tmp/1626621414-b4z5i8.png","tmp/1626621414-b4z5i9.png","tmp/1626621414-b4z5i10.png","tmp/1626621414-b4z5i11.png","tmp/1626621414-b4z5i12.png","tmp/1626621414-b4z5i13.png","tmp/1626621414-b4z5i14.png","tmp/1626621414-b4z5i15.png","tmp/1626621414-b4z5i16.png","tmp/1626621414-b4z5i17.png","tmp/1626621414-b4z5i18.png","tmp/1626621414-b4z5i19.png","tmp/1626621414-b4z5i20.png","tmp/1626621414-b4z5i21.png","tmp/1626621414-b4z5i22.png","tmp/1626621414-b4z5i23.png","tmp/1626621414-b4z5i24.png","tmp/1626621414-b4z5i25.png","tmp/1626621414-b4z5i26.png","tmp/1626621414-b4z5i27.png","tmp/1626621414-b4z5i28.png","tmp/1626621414-b4z5i29.png","tmp/1626621414-b4z5i30.png","tmp/1626621414-b4z5i31.png"],
      ["tmp/1626621414-b4z6i0.png","tmp/1626621414-b4z6i1.png","tmp/1626621414-b4z6i2.png","tmp/1626621414-b4z6i3.png","tmp/1626621414-b4z6i4.png","tmp/1626621414-b4z6i5.png","tmp/1626621414-b4z6i6.png","tmp/1626621414-b4z6i7.png","tmp/1626621414-b4z6i8.png","tmp/1626621414-b4z6i9.png","tmp/1626621414-b4z6i10.png","tmp/1626621414-b4z6i11.png","tmp/1626621414-b4z6i12.png","tmp/1626621414-b4z6i13.png","tmp/1626621414-b4z6i14.png","tmp/1626621414-b4z6i15.png","tmp/1626621414-b4z6i16.png","tmp/1626621414-b4z6i17.png","tmp/1626621414-b4z6i18.png","tmp/1626621414-b4z6i19.png","tmp/1626621414-b4z6i20.png","tmp/1626621414-b4z6i21.png","tmp/1626621414-b4z6i22.png","tmp/1626621414-b4z6i23.png","tmp/1626621414-b4z6i24.png","tmp/1626621414-b4z6i25.png","tmp/1626621414-b4z6i26.png","tmp/1626621414-b4z6i27.png","tmp/1626621414-b4z6i28.png","tmp/1626621414-b4z6i29.png","tmp/1626621414-b4z6i30.png","tmp/1626621414-b4z6i31.png","tmp/1626621414-b4z6i32.png","tmp/1626621414-b4z6i33.png","tmp/1626621414-b4z6i34.png","tmp/1626621414-b4z6i35.png","tmp/1626621414-b4z6i36.png","tmp/1626621414-b4z6i37.png","tmp/1626621414-b4z6i38.png","tmp/1626621414-b4z6i39.png","tmp/1626621414-b4z6i40.png","tmp/1626621414-b4z6i41.png","tmp/1626621414-b4z6i42.png","tmp/1626621414-b4z6i43.png","tmp/1626621414-b4z6i44.png","tmp/1626621414-b4z6i45.png","tmp/1626621414-b4z6i46.png","tmp/1626621414-b4z6i47.png","tmp/1626621414-b4z6i48.png","tmp/1626621414-b4z6i49.png","tmp/1626621414-b4z6i50.png","tmp/1626621414-b4z6i51.png","tmp/1626621414-b4z6i52.png","tmp/1626621414-b4z6i53.png","tmp/1626621414-b4z6i54.png","tmp/1626621414-b4z6i55.png","tmp/1626621414-b4z6i56.png","tmp/1626621414-b4z6i57.png","tmp/1626621414-b4z6i58.png","tmp/1626621414-b4z6i59.png","tmp/1626621414-b4z6i60.png","tmp/1626621414-b4z6i61.png","tmp/1626621414-b4z6i62.png","tmp/1626621414-b4z6i63.png"]]
  }
];
var dxinfoavailable=1;
var idletimeout=7200000;
var has_mobile=1;
