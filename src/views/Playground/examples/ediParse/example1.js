export default {
  key: 'ediParse1',
  type: 'ediParse',
  name: 'Example of rules necessary to parse EDI.',
  data: `ISA*01*0000000000*01*0000000000*ZZ*ABCDEFGHIJKLMNO*ZZ*123456789012345*101127*1719*U*00400*000003438*0*P*>
    GS*IN*4405197800*999999999*2011205*1710*1320*X*004010VICS
    ST*810*1004
    BIG*20101204*217224*20101204*P792940
    CUR*BT*USD
    N1*ST* *92*123
    N2*mexico
    N2*mexico
    N3*31875SOLONRD
    N3*31875SOLONRD
    N4*SOLON*OH*44139*MX
    N1*ST* *92*123
    N2*mexico
    N2*mexico
    N3*31875SOLONRD
    N3*31875SOLONRD
    N4*SOLON*OH*44139*MX
    ITD*01*3* * *0* *60* * * * * *15
    ITD*01*3* * *0* *60* * * * * *15
    IT1*001*1*EA*60.75*NT*IB*0895031892* * *PO*F6580987
    TXI*GS*18.99*7
    CTP* *SLP*19.95* * *DIS*8
    CTP* *SLP*19.95* * *DIS*8
    REF*DP*099
    REF*DP*099
    REF*DP*099
    IT1*001*1*EA*60.75*NT*IB*0895031892* * *PO*F6580987
    TXI*GS*18.99*7
    TXI*GS*18.99*8
    CTP* *SLP*19.95* * *DIS*8
    REF*DP*099
    REF*DP*099
    REF*DP*099
    TDS*21740
    TXI*GS*1.72*7*  * * * *24.62*VENDORTAXID
    SAC*C*D240* * *278* * * * * * * * * *Freight
    TXI*GS*20.99*8
    TXI*GS*20.99*8
    SAC*C*D240* * *278* * * * * * * * * *Freight
    TXI*GS*20.99*8
    TXI*GS*20.99*8
    CTT*8*9
    SE*18*1004
    GE*1*1320
    IEA*1*000001320
    `,
};
