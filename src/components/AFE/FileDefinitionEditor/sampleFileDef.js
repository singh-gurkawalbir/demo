export default {
  resourcePath: '',
  fileDefinition: {
    name: 'Amazon Vendor Central EDI 810',
    version: 1,
    format: 'delimited',
    delimited: {
      rowSuffix: '',
      rowDelimiter: '\n',
      colDelimiter: '*',
    },
    rules: [
      {
        required: true,
        maxOccurrence: 1,
        skipRowSuffix: true,
        elements: [
          {
            name: 'ISA',
            value: 'ISA',
          },
          {
            name: 'Authorization Information Qualifier',
            value: 'ISA01',
          },
          {
            name: 'Authorization Information',
            value: 'ISA02',
          },
          {
            name: 'Security Information Qualifier',
            value: 'ISA03',
          },
          {
            name: 'Security Information',
            value: 'ISA04',
          },
          {
            name: 'Interchange ID Qualifier(ISA05)',
            value: 'ISA05',
          },
          {
            name: 'Interchange Sender ID',
            value: 'ISA06',
          },
          {
            name: 'Interchange ID Qualifier(ISA07)',
            value: 'ISA07',
          },
          {
            name: 'Interchange Receiver ID',
            value: 'ISA08',
          },
          {
            name: 'Interchange Date',
            value: 'ISA09',
          },
          {
            name: 'Interchange Time',
            value: 'ISA10',
          },
          {
            name: 'Interchange Control Standards Identifier',
            value: 'ISA11',
          },
          {
            name: 'Interchange Control Version Number',
            value: 'ISA12',
          },
          {
            name: 'Interchange Control Number',
            value: 'ISA13',
          },
          {
            name: 'Acknowledgment Requested',
            value: 'ISA14',
          },
          {
            name: 'Usage Indicator',
            value: 'ISA15',
          },
          {
            name: 'Component Element Separator',
            value: 'ISA16',
          },
        ],
        children: [
          {
            required: true,
            maxOccurrence: 1,
            skipRowSuffix: true,
            elements: [
              {
                name: 'GS',
                value: 'GS',
              },
              {
                name: 'Functional Identifier Code',
                value: 'GS01',
              },
              {
                name: "Application Sender's Code",
                value: 'GS02',
              },
              {
                name: "Application Receiver's Code",
                value: 'GS03',
              },
              {
                name: 'Date',
                value: 'GS04',
              },
              {
                name: 'Time',
                value: 'GS05',
              },
              {
                name: 'Group Control Number',
                value: 'GS06',
              },
              {
                name: 'Responsible Agency Code',
                value: 'GS07',
              },
              {
                name: 'Version / Release / Industry Identifier Code',
                value: 'GS08',
              },
            ],
            children: [
              {
                required: true,
                maxOccurrence: 1,
                skipRowSuffix: true,
                elements: [
                  {
                    name: 'ST',
                    value: 'ST',
                  },
                  {
                    name: 'Transaction Set Identifier Code',
                    value: 'ST01',
                  },
                  {
                    name: 'Transaction Set Control Number',
                    value: 'ST02',
                  },
                ],
                children: [
                  {
                    required: true,
                    maxOccurrence: 1,
                    skipRowSuffix: true,
                    elements: [
                      {
                        name: 'BIG',
                        value: 'BIG',
                      },
                      {
                        name: 'Date(BIG01)',
                        value: 'BIG01',
                      },
                      {
                        name: 'Invoice Number',
                        value: 'BIG02',
                      },
                      {
                        name: 'Date of the PO creation',
                        value: 'BIG03',
                      },
                      {
                        name: 'Purchase Order Number',
                        value: 'BIG04',
                      },
                    ],
                    children: [
                      {
                        required: true,
                        maxOccurrence: 1,
                        skipRowSuffix: true,
                        elements: [
                          {
                            name: 'CUR',
                            value: 'CUR',
                          },
                          {
                            name: 'Entity Identifier Code',
                            value: 'CUR01',
                          },
                          {
                            name: 'Currency Code',
                            value: 'CUR02',
                          },
                        ],
                      },
                      {
                        name: 'N1',
                        maxOccurrence: 200,
                        container: true,
                        children: [
                          {
                            required: true,
                            skipRowSuffix: true,
                            elements: [
                              {
                                name: 'N1',
                                value: 'N1',
                              },
                              {
                                name: 'Entity Identifier Code',
                                value: 'N101',
                              },
                              {
                                name: 'Name',
                                value: 'N102',
                              },
                              {
                                name: 'Identification Code Qualifier',
                                value: 'N103',
                              },
                              {
                                name: 'Identification Code',
                                value: 'N104',
                              },
                            ],
                          },
                          {
                            name: 'N2',
                            maxOccurrence: 2,
                            container: true,
                            children: [
                              {
                                required: false,
                                skipRowSuffix: true,
                                elements: [
                                  {
                                    name: 'N2',
                                    value: 'N2',
                                  },
                                  {
                                    name: 'Name',
                                    value: 'N201',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            name: 'N3',
                            maxOccurrence: 2,
                            container: true,
                            children: [
                              {
                                required: true,
                                skipRowSuffix: true,
                                elements: [
                                  {
                                    name: 'N3',
                                    value: 'N3',
                                  },
                                  {
                                    name: 'Address Information',
                                    value: 'N301',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            required: true,
                            skipRowSuffix: true,
                            elements: [
                              {
                                name: 'N4',
                                value: 'N4',
                              },
                              {
                                name: 'City Name',
                                value: 'N401',
                              },
                              {
                                name: 'State or Province Code',
                                value: 'N402',
                              },
                              {
                                name: 'Postal Code',
                                value: 'N403',
                              },
                              {
                                name: 'Country Code',
                                value: 'N404',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: 'ITD',
                        maxOccurrence: 1000,
                        container: true,
                        children: [
                          {
                            required: true,
                            skipRowSuffix: true,
                            elements: [
                              {
                                name: 'ITD',
                                value: 'ITD',
                              },
                              {
                                name: 'Terms Type Code',
                                value: 'ITD01',
                              },
                              {
                                name: 'Terms Basis Date Code',
                                value: 'ITD02',
                              },
                              {
                                name: 'Terms Discount Percent',
                                value: 'ITD03',
                              },
                              {
                                name: 'Terms Discount Due Date',
                                value: 'ITD04',
                              },
                              {
                                name: 'Terms Discount Days Due',
                                value: 'ITD05',
                              },
                              {
                                name: 'Terms Net Due Date',
                                value: 'ITD06',
                              },
                              {
                                name: 'Terms Net Days',
                                value: 'ITD07',
                              },
                              {
                                name: 'ITD08',
                                value: 'ITD08',
                              },
                              {
                                name: 'ITD09',
                                value: 'ITD09',
                              },
                              {
                                name: 'ITD10',
                                value: 'ITD10',
                              },
                              {
                                name: 'ITD11',
                                value: 'ITD11',
                              },
                              {
                                name: 'ITD12',
                                value: 'ITD12',
                              },
                              {
                                name: 'Day of Month',
                                value: 'ITD13',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: 'IT1',
                        maxOccurrence: 200000,
                        container: true,
                        children: [
                          {
                            required: true,
                            skipRowSuffix: true,
                            elements: [
                              {
                                name: 'IT1',
                                value: 'IT1',
                              },
                              {
                                name: 'Assigned Identification',
                                value: 'IT101',
                              },
                              {
                                name: 'Quantity Invoiced',
                                value: 'IT102',
                              },
                              {
                                name: 'Unit or Basis for Measurement Code',
                                value: 'IT103',
                              },
                              {
                                name: 'Unit Price',
                                value: 'IT104',
                              },
                              {
                                name: 'Basis of Unit Price Code',
                                value: 'IT105',
                              },
                              {
                                name: 'Product/Service ID Qualifier(IT106)',
                                value: 'IT106',
                              },
                              {
                                name: 'Product/Service ID(IT107)',
                                value: 'IT107',
                              },
                              {
                                name: 'Product/Service ID Qualifier(IT108)',
                                value: 'IT108',
                              },
                              {
                                name: 'Product/Service ID(IT109)',
                                value: 'IT109',
                              },
                              {
                                name: 'Product/Service ID Qualifier(IT110)',
                                value: 'IT110',
                              },
                              {
                                name: 'Product/Service ID(IT111)',
                                value: 'IT111',
                              },
                            ],
                          },
                          {
                            name: 'TXI',
                            maxOccurrence: 10,
                            container: true,
                            children: [
                              {
                                required: false,
                                skipRowSuffix: true,
                                elements: [
                                  {
                                    name: 'TXI',
                                    value: 'TXI',
                                  },
                                  {
                                    name: 'Tax Type Code',
                                    value: 'TXI01',
                                  },
                                  {
                                    name: 'Monetary Amount',
                                    value: 'TXI02',
                                  },
                                  {
                                    name: 'Percent',
                                    value: 'TXI03',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            name: 'CTP',
                            maxOccurrence: 25,
                            container: true,
                            children: [
                              {
                                required: false,
                                skipRowSuffix: true,
                                elements: [
                                  {
                                    name: 'CTP',
                                    value: 'CTP',
                                  },
                                  {
                                    name: 'CTP01',
                                    value: 'CTP01',
                                  },
                                  {
                                    name: 'Price Identifier Code',
                                    value: 'CTP02',
                                  },
                                  {
                                    name: 'Unit Price',
                                    value: 'CTP03',
                                  },
                                  {
                                    name: 'CTP04',
                                    value: 'CTP04',
                                  },
                                  {
                                    name: 'CTP05',
                                    value: 'CTP05',
                                  },
                                  {
                                    name: 'Price Multiplier Qualifier',
                                    value: 'CTP06',
                                  },
                                  {
                                    name: 'Multiplier',
                                    value: 'CTP07',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            name: 'REF',
                            maxOccurrence: 1000,
                            container: true,
                            children: [
                              {
                                required: false,
                                skipRowSuffix: true,
                                elements: [
                                  {
                                    name: 'REF',
                                    value: 'REF',
                                  },
                                  {
                                    name: 'Reference Identification Qualifier',
                                    value: 'REF01',
                                  },
                                  {
                                    name: 'Reference Identification',
                                    value: 'REF02',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        required: true,
                        maxOccurrence: 1,
                        skipRowSuffix: true,
                        elements: [
                          {
                            name: 'TDS',
                            value: 'TDS',
                          },
                          {
                            name: 'Amount',
                            value: 'TDS01',
                          },
                        ],
                      },
                      {
                        name: 'TXI',
                        maxOccurrence: 10,
                        container: true,
                        children: [
                          {
                            required: false,
                            skipRowSuffix: true,
                            elements: [
                              {
                                name: 'TXI',
                                value: 'TXI',
                              },
                              {
                                name: 'Tax Type Code',
                                value: 'TXI01',
                              },
                              {
                                name: 'Monetary Amount',
                                value: 'TXI02',
                              },
                              {
                                name: 'Percent',
                                value: 'TXI03',
                              },
                              {
                                name: 'TXI04',
                                value: 'TXI04',
                              },
                              {
                                name: 'TXI05',
                                value: 'TXI05',
                              },
                              {
                                name: 'Tax Exempt Code',
                                value: 'TXI06',
                              },
                              {
                                name: 'TXI07',
                                value: 'TXI07',
                              },
                              {
                                name: 'Dollar Basis For Percent',
                                value: 'TXI08',
                              },
                              {
                                name: 'Tax Identification Number',
                                value: 'TXI09',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: 'SAC',
                        maxOccurrence: 25,
                        container: true,
                        children: [
                          {
                            required: false,
                            skipRowSuffix: true,
                            elements: [
                              {
                                name: 'SAC',
                                value: 'SAC',
                              },
                              {
                                name: 'Allowance or Charge Indicator',
                                value: 'SAC01',
                              },
                              {
                                name:
                                  'Service, Promotion, Allowance, or ChargeCode',
                                value: 'SAC02',
                              },
                              {
                                name: 'SAC03',
                                value: 'SAC03',
                              },
                              {
                                name: 'SAC04',
                                value: 'SAC04',
                              },
                              {
                                name: 'Amount(SAC05)',
                                value: 'SAC05',
                              },
                              {
                                name: 'SAC06',
                                value: 'SAC06',
                              },
                              {
                                name: 'SAC07',
                                value: 'SAC07',
                              },
                              {
                                name: 'SAC08',
                                value: 'SAC08',
                              },
                              {
                                name: 'SAC09',
                                value: 'SAC09',
                              },
                              {
                                name: 'SAC10',
                                value: 'SAC10',
                              },
                              {
                                name: 'SAC11',
                                value: 'SAC11',
                              },
                              {
                                name: 'SAC12',
                                value: 'SAC12',
                              },
                              {
                                name: 'SAC13',
                                value: 'SAC13',
                              },
                              {
                                name: 'SAC14',
                                value: 'SAC14',
                              },
                              {
                                name: 'Description',
                                value: 'SAC15',
                              },
                            ],
                          },
                          {
                            name: 'TXI',
                            maxOccurrence: 10,
                            container: true,
                            children: [
                              {
                                required: false,
                                skipRowSuffix: true,
                                elements: [
                                  {
                                    name: 'TXI',
                                    value: 'TXI',
                                  },
                                  {
                                    name: 'Tax Type Code',
                                    value: 'TXI01',
                                  },
                                  {
                                    name: 'Monetary Amount',
                                    value: 'TXI02',
                                  },
                                  {
                                    name: 'Percent',
                                    value: 'TXI03',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    closeRule: {
                      required: true,
                      maxOccurrence: 1,
                      skipRowSuffix: true,
                      elements: [
                        {
                          name: 'CTT',
                          value: 'CTT',
                        },
                        {
                          name: 'Number of Line Items',
                          value: 'CTT01',
                        },
                        {
                          name: 'Hash Total',
                          value: 'CTT02',
                        },
                      ],
                    },
                  },
                ],
                closeRule: {
                  required: true,
                  maxOccurrence: 1,
                  skipRowSuffix: true,
                  elements: [
                    {
                      name: 'SE',
                      value: 'SE',
                    },
                    {
                      name: 'Number of Included Segments',
                      value: 'SE01',
                    },
                    {
                      name: 'SE Transaction Set Control Number',
                      value: 'SE02',
                    },
                  ],
                },
              },
            ],
            closeRule: {
              required: true,
              maxOccurrence: 1,
              skipRowSuffix: true,
              elements: [
                {
                  name: 'GE',
                  value: 'GE',
                },
                {
                  name: 'Number of Transaction Sets Included',
                  value: 'GE01',
                },
                {
                  name: 'GE Group Control Number',
                  value: 'GE02',
                },
              ],
            },
          },
        ],
        closeRule: {
          required: true,
          maxOccurrence: 1,
          skipRowSuffix: true,
          elements: [
            {
              name: 'IEA',
              value: 'IEA',
            },
            {
              name: 'Number of Included Functional Groups',
              value: 'IEA01',
            },
            {
              name: 'IEA Interchange Control Number',
              value: 'IEA02',
            },
          ],
        },
      },
    ],
    description: 'Invoice',
  },
};
