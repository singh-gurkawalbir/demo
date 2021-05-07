/* global describe, test, expect */
import reducer, {selectors} from '.';
import actions from '../../../../actions';

const amazonCategoryMappings = {
  uiAssistant: 'amazon',
  response: [
    {
      operation: 'mappingData',
      data: {
        mappingData: {
          basicMappings: {
            recordMappings: [
              {
                id: 'commonAttributes',
                name: 'Common',
                children: [
                  {
                    id: 'Dimensions',
                    name: 'Dimensions',
                    children: [

                    ],
                    fieldMappings: [

                    ],
                  },
                  {
                    id: 'Discovery',
                    name: 'Discovery',
                    children: [

                    ],
                    fieldMappings: [

                    ],
                  },
                  {
                    id: 'Images',
                    name: 'Images',
                    children: [

                    ],
                    fieldMappings: [

                    ],
                  },
                  {
                    id: 'Fulfillment',
                    name: 'Fulfillment',
                    children: [

                    ],
                    fieldMappings: [

                    ],
                  },
                ],
                fieldMappings: [
                  {
                    extract: 'SKU',
                    generate: 'item_sku',
                    discardIfEmpty: true,
                  },
                  {
                    extract: 'upccode',
                    generate: 'UPC',
                    discardIfEmpty: true,
                  },
                  {
                    extract: 'salesdescription',
                    generate: 'product_description',
                    discardIfEmpty: true,
                  },
                  {
                    extract: 'displayname',
                    generate: 'item_name',
                    discardIfEmpty: true,
                  },
                  {
                    extract: 'manufacturer',
                    generate: 'brand_name',
                    discardIfEmpty: true,
                  },
                ],
                lookups: [

                ],
              },
            ],
          },
          variationMappings: {
            recordMappings: [],
          },
        },
      },
    },
    {
      operation: 'extractsMetaData',
      data: [
        {
          id: 'hits',
          type: 'integer',
          name: '# Times Viewed',
        },
        {
          id: 'atpleadtime',
          type: 'float',
          name: 'ATP Lead Time',
        },
        {
          id: 'accountingbook',
          type: 'select',
          name: 'Accounting Book',
        },
        {
          id: 'accountingbookamortization',
          type: 'select',
          name: 'Accounting Book Amortization Schedule',
        },
        {
          id: 'accountingbookrevrecschedule',
          type: 'select',
          name: 'Accounting Book Rev. Rec. Schedule',
        },
        {
          id: 'custitem_celigo_ebay_list_add_fee',
          type: 'text',
          name: 'Add Listing Fee',
        },
        {
          id: 'custitem_celigo_etail_channel',
          type: 'multiselect',
          name: 'eTail Channel (2)',
        },
      ],
    },
    {
      operation: 'generatesMetaData',
      data: {
        categoryRelationshipData: [
          {
            id: 'autoaccessory',
            name: 'Auto Accessory',
            isLeafNode: false,
            marketplace_domain: 'US',
            children: [
              {
                id: 'autoaccessorymisc',
                name: 'autoaccessorymisc',
                isLeafNode: true,
              },
              {
                id: 'autobattery',
                name: 'autobattery',
                isLeafNode: true,
              },
              {
                id: 'autooil',
                name: 'autooil',
                isLeafNode: true,
              },
              {
                id: 'Underwear',
                name: 'Underwear [Moved to Clothing]',
                isLeafNode: true,
              },
            ],
          },
          {
            id: 'baby',
            name: 'Baby',
            isLeafNode: false,
            marketplace_domain: 'US',
            children: [
              {
                id: 'babyproducts',
                name: 'babyproducts',
                isLeafNode: true,
              },
              {
                id: 'infanttoddlercarseat',
                name: 'infanttoddlercarseat',
                isLeafNode: true,
              },
              {
                id: 'stroller',
                name: 'stroller',
                isLeafNode: true,
              },
            ],
          },
          {
            id: 'beauty',
            name: 'Beauty',
            isLeafNode: false,
            marketplace_domain: 'US',
            children: [
              {
                id: 'beautymisc',
                name: 'beautymisc',
                isLeafNode: true,
              },
              {
                id: 'bodycareproduct',
                name: 'bodycareproduct',
                isLeafNode: true,
              },
              {
                id: 'conditioner',
                name: 'conditioner',
                isLeafNode: true,
              },
            ],
          },
          {
            id: 'BookLoader',
            name: 'Book Loader',
            isLeafNode: true,
            marketplace_domain: 'US',
            children: [

            ],
          },
          {
            id: 'cameraandphoto',
            name: 'Camera and Photo',
            isLeafNode: false,
            marketplace_domain: 'US',
            children: [
              {
                id: 'binocular',
                name: 'binocular',
                isLeafNode: true,
              },
              {
                id: 'blankmediaforcameras',
                name: 'blankmediaforcameras',
                isLeafNode: true,
              },
              {
                id: 'camcorder',
                name: 'camcorder',
                isLeafNode: true,
              },
              {
                id: 'Tripod',
                name: 'Tripod [Deprecated]',
                isLeafNode: true,
              },
            ],
          },
          {
            id: 'clothing',
            name: 'Clothing',
            isLeafNode: false,
            marketplace_domain: 'US',
            children: [
              {
                id: 'PROTECTIVE_GLOVE',
                name: 'PROTECTIVE_GLOVE',
                isLeafNode: true,
              },
              {
                id: 'accessory',
                name: 'accessory',
                isLeafNode: true,
              },
              {
                id: 'childrenscostume',
                name: 'childrenscostume',
                isLeafNode: true,
              },
              {
                id: 'vest',
                name: 'vest',
                isLeafNode: true,
              },
            ],
          },
          {
            id: 'coins',
            name: 'Coins',
            isLeafNode: false,
            marketplace_domain: 'US',
            children: [
              {
                id: 'Bullion',
                name: 'Bullion',
                isLeafNode: true,
              },
              {
                id: 'Coins',
                name: 'Coins',
                isLeafNode: true,
              },
              {
                id: 'CollectibleCoins',
                name: 'CollectibleCoins',
                isLeafNode: true,
              },
            ],
          },
          {
            id: 'FoodServiceAndJanSan',
            name: 'Food Service and Jan San',
            isLeafNode: false,
            marketplace_domain: 'US',
            children: [
              {
                id: 'FoodServiceSupply',
                name: 'FoodServiceSupply',
                isLeafNode: true,
              },
              {
                id: 'JanitorialSupply',
                name: 'JanitorialSupply',
                isLeafNode: true,
              },
            ],
          },
        ],
        generatesMetaData: {
          id: 'commonAttributes',
          name: 'Common',
          variation_themes: [],
          variation_attributes: [],
          fields: [
            {
              id: 'item_sku',
              name: 'Seller SKU',
              description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
              filterType: 'required',
              type: 'input',
              options: [],
            },
            {
              id: 'item_name',
              name: 'Product Name',
              description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
              filterType: 'required',
              type: 'input',
              options: [],
            },
            {
              id: 'ASIN',
              name: 'ASIN',
              description: 'A standard, alphanumeric string that uniquely identifies the product.',
              filterType: 'preferred',
              type: 'input',
              options: [],
            },
            {
              id: 'UPC',
              name: 'UPC',
              description: 'A standard, alphanumeric string that uniquely identifies the product.',
              filterType: 'preferred',
              type: 'input',
              options: [],
            },
            {
              id: 'item_length_unit_of_measure',
              name: 'Item Length Unit Of Measure',
              description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
              filterType: 'optional',
              type: 'select',
              options: [
                {
                  id: 'CM',
                  text: 'CM',
                },
                {
                  id: 'FT',
                  text: 'FT',
                },
                {
                  id: 'IN',
                  text: 'IN',
                },
                {
                  id: 'M',
                  text: 'M',
                },
                {
                  id: 'MM',
                  text: 'MM',
                },
              ],
            },
          ],
          children: [],
          isLeafNode: false,
          marketplace_domain: 'US',
        },
      },
    },
  ],
};
const walmartCategoryMappings = {
  uiAssistant: 'walmart',
  response: [
    {
      operation: 'mappingData',
      data: {
        mappingData: {
          basicMappings: {
            recordMappings: [
              {
                id: 'commonAttributes',
                name: 'Common',
                children: [
                  {
                    id: 'Dimensions',
                    name: 'Dimensions',
                    children: [

                    ],
                    fieldMappings: [
                      {
                        extract: 'weight',
                        generate: 'ShippingWeight',
                        discardIfEmpty: true,
                      },
                      {
                        extract: 'weightunit',
                        generate: 'ShippingWeightUnit',
                        discardIfEmpty: true,
                      },
                    ],
                  },
                  {
                    id: 'Compliance',
                    name: 'Compliance',
                    children: [

                    ],
                    fieldMappings: [

                    ],
                  },
                  {
                    id: 'Images',
                    name: 'Images',
                    children: [

                    ],
                    fieldMappings: [

                    ],
                  },
                  {
                    id: 'Offer',
                    name: 'Offer',
                    children: [

                    ],
                    fieldMappings: [

                    ],
                  },
                  {
                    id: 'Variation',
                    name: 'Variation',
                    children: [

                    ],
                    fieldMappings: [

                    ],
                  },
                ],
                fieldMappings: [
                  {
                    extract: 'upccode',
                    generate: 'UPC',
                    discardIfEmpty: true,
                  },
                  {
                    extract: 'displayname',
                    generate: 'productName',
                    discardIfEmpty: true,
                  },
                  {
                    extract: 'salesdescription',
                    generate: 'shortDescription',
                    discardIfEmpty: true,
                  },
                  {
                    extract: 'manufacturer',
                    generate: 'brand',
                    discardIfEmpty: true,
                  },
                ],
                lookups: [

                ],
              },
              {
                id: 'Animal',
                name: 'Animal',
                children: [
                  {
                    id: 'AnimalAccessories',
                    name: 'Animal Accessories',
                    children: [

                    ],
                    fieldMappings: [
                      {
                        extract: 'hits',
                        generate: 'globalBrandLicenseValue.1',
                        discardIfEmpty: true,
                      },
                    ],
                  },
                ],
                fieldMappings: [
                  {
                    extract: 'hits',
                    generate: 'animalType',
                    discardIfEmpty: true,
                  },
                ],
                lookups: [

                ],
              },
            ],
          },
          variationMappings: {
            recordMappings: [
              {
                id: 'Animal',
                children: [

                ],
                fieldMappings: [

                ],
              },
              {
                id: 'ArtAndCraftCategory',
                children: [

                ],
                fieldMappings: [

                ],
              },
            ],
          },
        },
      },
    },
    {
      operation: 'extractsMetaData',
      data: [
        {
          id: 'hits',
          type: 'integer',
          name: '# Times Viewed',
        },
        {
          id: 'atpleadtime',
          type: 'float',
          name: 'ATP Lead Time',
        },
        {
          id: 'accountingbook',
          type: 'select',
          name: 'Accounting Book',
        },
        {
          id: 'custitem_celigo_etail_channel',
          type: 'multiselect',
          name: 'eTail Channel (2)',
        },
      ],
    },
    {
      operation: 'generatesMetaData',
      data: {
        categoryRelationshipData: [
          {
            id: 'Animal',
            name: 'Animal',
            children: [
              {
                id: 'AnimalAccessories',
                name: 'Animal Accessories',
                isLeafNode: true,
              },
              {
                id: 'AnimalFood',
                name: 'Animal Food',
                isLeafNode: true,
              },
              {
                id: 'AnimalHealthAndGrooming',
                name: 'Animal Health & Grooming',
                isLeafNode: true,
              },
              {
                id: 'AnimalEverythingElse',
                name: 'Animal Other',
                isLeafNode: true,
              },
            ],
            isLeafNode: false,
          },
          {
            id: 'ArtAndCraft',
            name: 'Art And Craft[Use Art And Craft Category]',
            children: [
              {
                id: 'ArtAndCraft',
                name: 'Art & Craft',
                isLeafNode: true,
              },
            ],
            isLeafNode: false,
          },
          {
            id: 'OfficeCategory',
            name: 'Office Category',
            children: [
              {
                id: 'Office',
                name: 'Office',
                isLeafNode: true,
              },
            ],
            isLeafNode: false,
          },
          {
            id: 'Photography',
            name: 'Photography',
            children: [
              {
                id: 'CamerasAndLenses',
                name: 'Cameras & Lenses',
                isLeafNode: true,
              },
              {
                id: 'PhotoAccessories',
                name: 'Photo Accessories',
                isLeafNode: true,
              },
            ],
            isLeafNode: false,
          },
          {
            id: 'SportAndRecreation',
            name: 'Sport and Recreation',
            children: [
              {
                id: 'Cycling',
                name: 'Cycling',
                isLeafNode: true,
              },
              {
                id: 'Optics',
                name: 'Optics',
                isLeafNode: true,
              },
              {
                id: 'SportAndRecreationOther',
                name: 'Sport & Recreation Other',
                isLeafNode: true,
              },
              {
                id: 'Weapons',
                name: 'Weapons',
                isLeafNode: true,
              },
            ],
            isLeafNode: false,
          },
          {
            id: 'ToolsAndHardware',
            name: 'Tools And Hardware',
            children: [
              {
                id: 'BuildingSupply',
                name: 'Building Supply',
                isLeafNode: true,
              },
              {
                id: 'Electrical',
                name: 'Electrical',
                isLeafNode: true,
              },
              {
                id: 'Hardware',
                name: 'Hardware',
                isLeafNode: true,
              },
              {
                id: 'PlumbingAndHVAC',
                name: 'Plumbing & HVAC',
                isLeafNode: true,
              },
              {
                id: 'Tools',
                name: 'Tools',
                isLeafNode: true,
              },
              {
                id: 'ToolsAndHardwareOther',
                name: 'Tools & Hardware Other',
                isLeafNode: true,
              },
            ],
            isLeafNode: false,
          },
        ],
        generatesMetaData: {
          id: 'commonAttributes',
          name: 'Common',
          variation_attributes: [

          ],
          fields: [
            {
              id: 'ProductTaxCode',
              name: 'Product Tax Code',
              description: 'This is a seven digit code used in Taxware that enables customers to save money on sales tax based on their state of residence and the properties of the product. To learn how to select the correct code, you may watch this video: https://vimeo.com/164512893 ',
              filterType: 'optional',
              type: 'input',
              options: [

              ],
            },
            {
              id: 'keyFeaturesValue.5',
              name: 'Key Features 5',
              description: 'Key features will appear as bulleted text on the item page and in search results. Key features help the user understand the benefits of the product with a simple and clean format. We highly recommended using three or more key features.',
              filterType: 'preferred',
              type: 'input',
              options: [

              ],
            },
          ],
          children: [
            {
              id: 'Dimensions',
              name: 'Dimensions',
              variation_attributes: [

              ],
              fields: [
                {
                  id: 'ShippingWeight.measure',
                  name: 'Shipping Weight > Measure',
                  description: 'Input the weight of the individual selling unit.',
                  filterType: 'optional',
                  type: 'select',
                  options: [
                    {
                      id: 'lb',
                      text: 'lb',
                    },
                  ],
                },
                {
                  id: 'assembledProductWeight.unit',
                  name: 'Assembled Product Weight > Unit',
                  description: 'The weight of the fully assembled product. NOTE: This information is shown on the item page.',
                  filterType: 'optional',
                  type: 'select',
                  options: [
                    {
                      id: 'oz',
                      text: 'oz',
                    },
                    {
                      id: 'lb',
                      text: 'lb',
                    },
                    {
                      id: 'g',
                      text: 'g',
                    },
                    {
                      id: 'kg',
                      text: 'kg',
                    },
                  ],
                },
              ],
              children: [

              ],
              isLeafNode: false,
            },
            {
              id: 'Variation',
              name: 'Variation',
              variation_attributes: [

              ],
              fields: [
                {
                  id: 'swatchImage.1.swatchVariantAttribute',
                  name: 'Swatch Images > Swatch Variant Attribute 1',
                  description: 'Attribute name corresponding to the swatch.',
                  filterType: 'conditional',
                  type: 'select',
                  options: [

                  ],
                },
                {
                  id: 'swatchImage.2.swatchVariantAttribute',
                  name: 'Swatch Images > Swatch Variant Attribute 2',
                  description: 'Attribute name corresponding to the swatch.',
                  filterType: 'conditional',
                  type: 'select',
                  options: [

                  ],
                },
                {
                  id: 'swatchImage.3.swatchVariantAttribute',
                  name: 'Swatch Images > Swatch Variant Attribute 3',
                  description: 'Attribute name corresponding to the swatch.',
                  filterType: 'conditional',
                  type: 'select',
                  options: [

                  ],
                },
                {
                  id: 'swatchImage.4.swatchVariantAttribute',
                  name: 'Swatch Images > Swatch Variant Attribute 4',
                  description: 'Attribute name corresponding to the swatch.',
                  filterType: 'conditional',
                  type: 'select',
                  options: [

                  ],
                },
                {
                  id: 'swatchImage.5.swatchVariantAttribute',
                  name: 'Swatch Images > Swatch Variant Attribute 5',
                  description: 'Attribute name corresponding to the swatch.',
                  filterType: 'conditional',
                  type: 'select',
                  options: [

                  ],
                },
              ],
              children: [

              ],
              isLeafNode: false,
            },
          ],
          isLeafNode: false,
        },
      },
    },
  ],
};

describe('integrationApps reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({ });
  });
  describe('intetgrationApps settings reducer', () => {
    describe('integrationApps settings form init action', () => {
      test('should not affect existing state when initComplete function called and update the correct id', () => {
        const state = reducer({
          '1-2': {formSaveStatus: 'loading'},
        }, actions.integrationApp.settings.initComplete('1', '3'));

        expect(state).toEqual({
          '1-2': { formSaveStatus: 'loading'},
          '1-3': { initComplete: true},
        });
      });
    });
    describe('integrationApps settings update action', () => {
      test('should not affect the existing state when  update function  is called', () => {
        const state = reducer(
          { '1-2': { formSaveStatus: 'loading' } },
          actions.integrationApp.settings.update(
            'integrationId',
            'flowId',
            'storeId',
            null,
            'INCORRECT_FUNCTION_NAME'
          )
        );
        const expectedValue = {

          '1-2': { formSaveStatus: 'loading' },
          'integrationId-flowId': { formSaveStatus: 'loading' },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the key by integrationId and flowId passed and set submitComplete flag to false', () => {
        const state = reducer(
          { 'integrationId-flowId': { formSaveStatus: 'complete' } },
          actions.integrationApp.settings.update(
            'integrationId',
            'flowId',
            'storeId',
            null,
            'INCORRECT_FUNCTION_NAME'
          )
        );
        const expectedValue = {
          'integrationId-flowId': { formSaveStatus: 'loading' },
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps settings addon request license metadata action', () => {
      test('should set license metadata on to the state and should not clear other data', () => {
        const state = reducer({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
        }, actions.integrationApp.settings.requestAddOnLicenseMetadata('integrationId'));

        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          'integrationId-addOns': { status: 'requested'},
        });
      });
    });

    describe('integrationApps settings addon license metadata failure action', () => {
      test('should set license metadata failure flag on to the state and should not clear other data', () => {
        let state = reducer({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          'integrationId-addOns': { status: 'requested'},
        }, actions.integrationApp.settings.addOnLicenseMetadataFailed('integrationId'));

        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          'integrationId-addOns': { status: 'failed'},
        });

        state = reducer(state, actions.integrationApp.settings.addOnLicenseMetadataFailed('integrationId2'));
        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          'integrationId-addOns': { status: 'failed'},
          'integrationId2-addOns': { status: 'failed'},
        });
      });
    });

    describe('integrationApps settings addon license metadata received action', () => {
      test('should set license metadata received flag and response on to the state and should not clear other data', () => {
        let state = reducer({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          'integrationId-addOns': { status: 'requested'},
        }, actions.integrationApp.settings.addOnLicenseMetadataUpdate('integrationId', {
          addOns: {
            addOnMetaData: { data: 'dummy'},
            addOnLicenses: [{_id: 'license'}],
          },
        }));

        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          'integrationId-addOns': {
            status: 'received',
            addOns: {
              addOnMetaData: { data: 'dummy'},
              addOnLicenses: [{_id: 'license'}],
            },
          },
        });

        state = reducer(state, actions.integrationApp.settings.addOnLicenseMetadataUpdate('integrationId2', {
          addOns: {
            addOnMetaData: { data: 'dummy'},
            addOnLicenses: [{_id: 'license1'}],
          },
        }));
        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          'integrationId-addOns': {
            status: 'received',
            addOns: {
              addOnMetaData: { data: 'dummy'},
              addOnLicenses: [{_id: 'license'}],
            },
          },
          'integrationId2-addOns': {
            status: 'received',
            addOns: {
              addOnMetaData: { data: 'dummy'},
              addOnLicenses: [{_id: 'license1'}],
            },
          },
        });
      });
    });

    describe('integrationApps settings request mapping metadata action', () => {
      test('should set license metadata on to the state and should not clear other data', () => {
        let state = reducer({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          integrationId2: { status: 'failed'},
        }, actions.integrationApp.settings.requestMappingMetadata('integrationId'));

        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          integrationId: { status: 'requested'},
          integrationId2: { status: 'failed'},
        });

        state = reducer(state, actions.integrationApp.settings.requestMappingMetadata('integrationId2'));
        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          integrationId: { status: 'requested'},
          integrationId2: {status: 'requested'},
        });
      });
    });

    describe('integrationApps settings mapping metadata received action', () => {
      test('should set mapping metadata received flag and response on to the state and should not clear other data', () => {
        let state = reducer({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          integrationId: { status: 'requested'},
        }, actions.integrationApp.settings.mappingMetadataUpdate('integrationId', {
          data: {
            prop1: { data: 'dummy'},
            prop2: [{_id: 'license'}],
          },
        }));

        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          integrationId: {
            status: 'received',
            mappingMetadata: {
              data: {
                prop1: { data: 'dummy'},
                prop2: [{_id: 'license'}],
              },
            },
          },
        });

        state = reducer(state, actions.integrationApp.settings.mappingMetadataUpdate('integrationId2', {
          data: {
            prop1: { data: 'dummy'},
            prop2: [{_id: 'license'}],
          },
        }));

        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          integrationId: {
            status: 'received',
            mappingMetadata: {
              data: {
                prop1: { data: 'dummy'},
                prop2: [{_id: 'license'}],
              },
            },
          },
          integrationId2: {
            status: 'received',
            mappingMetadata: {
              data: {
                prop1: { data: 'dummy'},
                prop2: [{_id: 'license'}],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings mapping metadata failure action', () => {
      test('should set mapping metadata failure flag on to the state and should not clear other data', () => {
        let state = reducer({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          integrationId: { status: 'requested'},
        }, actions.integrationApp.settings.mappingMetadataError('integrationId', 'Error Message'));

        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          integrationId: { status: 'error', error: 'Error Message'},
        });

        state = reducer(state, actions.integrationApp.settings.mappingMetadataError('integrationId2', 'Error Message'));
        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          integrationId: { status: 'error', error: 'Error Message'},
          integrationId2: { status: 'error', error: 'Error Message'},
        });
      });
    });

    describe('integrationApps settings form failure action', () => {
      test('should not affect the existing state when  failure function  is called', () => {
        const state = reducer(
          { '1-2': { formSaveStatus: 'loading' } },
          actions.integrationApp.settings.submitFailed({
            integrationId: 'integrationId',
            flowId: 'flowId',
            storeId: 'storeId',
          })
        );
        const expectedValue = {

          '1-2': { formSaveStatus: 'loading' },
          'integrationId-flowId': { formSaveStatus: 'failed' },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the key by integrationId and flowId passed and set submitComplete flag to false', () => {
        const state = reducer(
          { 'integrationId-flowId': { formSaveStatus: 'complete' } },
          actions.integrationApp.settings.submitFailed({
            integrationId: 'integrationId',
            flowId: 'flowId',
            storeId: 'storeId',
          })
        );
        const expectedValue = {
          'integrationId-flowId': { formSaveStatus: 'failed' },
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps settings upgrade requested action', () => {
      test('should set upgrade request on to the state and should not clear other data', () => {
        const state = reducer({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
        }, actions.integrationApp.settings.requestedUpgrade('licenseId'));

        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          licenseId: true,
        });
      });
    });

    describe('integrationApps settings category mappings receivedCategoryMappingMetadata mappings', () => {
      test('should save variation mappings correctly for amazon categoory mappings', () => {
        const state = reducer({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
        }, actions.integrationApp.settings.receivedCategoryMappingMetadata('integrationId', 'flowId', amazonCategoryMappings));

        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          'flowId-integrationId': {
            uiAssistant: amazonCategoryMappings.uiAssistant,
            response: amazonCategoryMappings.response,
            filters: {
              attributes: {
                required: true,
                optional: false,
                conditional: false,
                preferred: false,
              },
              mappingFilter: 'all',
            },
            generatesMetadata: [
              {
                children: [

                ],
                fields: [
                  {
                    description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                    filterType: 'required',
                    id: 'item_sku',
                    name: 'Seller SKU',
                    options: [

                    ],
                    type: 'input',

                  },
                  {
                    description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
                    filterType: 'required',
                    id: 'item_name',
                    name: 'Product Name',
                    options: [

                    ],
                    type: 'input',

                  },
                  {
                    description: 'A standard, alphanumeric string that uniquely identifies the product.',
                    filterType: 'preferred',
                    id: 'ASIN',
                    name: 'ASIN',
                    options: [

                    ],
                    type: 'input',

                  },
                  {
                    description: 'A standard, alphanumeric string that uniquely identifies the product.',
                    filterType: 'preferred',
                    id: 'UPC',
                    name: 'UPC',
                    options: [

                    ],
                    type: 'input',

                  },
                  {
                    description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
                    filterType: 'optional',
                    id: 'item_length_unit_of_measure',
                    name: 'Item Length Unit Of Measure',
                    options: [
                      {
                        id: 'CM',
                        text: 'CM',

                      },
                      {
                        id: 'FT',
                        text: 'FT',

                      },
                      {
                        id: 'IN',
                        text: 'IN',

                      },
                      {
                        id: 'M',
                        text: 'M',

                      },
                      {
                        id: 'MM',
                        text: 'MM',

                      },

                    ],
                    type: 'select',

                  },

                ],
                id: 'commonAttributes',
                isLeafNode: false,
                marketplace_domain: 'US',
                name: 'Common',
                variation_attributes: [

                ],
                variation_themes: [

                ],

              },

            ],
            initMappingData: {
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        children: [
                          {
                            children: [

                            ],
                            fieldMappings: [

                            ],
                            id: 'Dimensions',
                            name: 'Dimensions',

                          },
                          {
                            children: [

                            ],
                            fieldMappings: [

                            ],
                            id: 'Discovery',
                            name: 'Discovery',

                          },
                          {
                            children: [

                            ],
                            fieldMappings: [

                            ],
                            id: 'Images',
                            name: 'Images',

                          },
                          {
                            children: [

                            ],
                            fieldMappings: [

                            ],
                            id: 'Fulfillment',
                            name: 'Fulfillment',

                          },

                        ],
                        fieldMappings: [
                          {
                            discardIfEmpty: true,
                            extract: 'SKU',
                            generate: 'item_sku',

                          },
                          {
                            discardIfEmpty: true,
                            extract: 'upccode',
                            generate: 'UPC',

                          },
                          {
                            discardIfEmpty: true,
                            extract: 'salesdescription',
                            generate: 'product_description',

                          },
                          {
                            discardIfEmpty: true,
                            extract: 'displayname',
                            generate: 'item_name',

                          },
                          {
                            discardIfEmpty: true,
                            extract: 'manufacturer',
                            generate: 'brand_name',

                          },

                        ],
                        id: 'commonAttributes',
                        lookups: [

                        ],
                        name: 'Common',

                      },

                    ],

                  },
                  variationMappings: {
                    recordMappings: [

                    ],

                  },

                },

              },
              operation: 'mappingData',

            },
          },
        });
      });

      test('should save variation mappings correctly for walmart category mappings', () => {
        const state = reducer({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
        }, actions.integrationApp.settings.receivedCategoryMappingMetadata('integrationId', 'flowId', walmartCategoryMappings));

        expect(state).toEqual({
          '1-3': { initComplete: true},
          '1-2': { formSaveStatus: 'loading'},
          'flowId-integrationId': {
            uiAssistant: walmartCategoryMappings.uiAssistant,
            response: walmartCategoryMappings.response,
            filters: {
              attributes: {
                required: true,
                optional: false,
                conditional: false,
                preferred: false,
              },
              mappingFilter: 'all',
            },
            generatesMetadata: [
              {
                children: [
                  {
                    children: [],
                    fields: [
                      {
                        description: 'Input the weight of the individual selling unit.',
                        filterType: 'optional',
                        id: 'ShippingWeight.measure',
                        name: 'Shipping Weight > Measure',
                        options: [
                          {
                            id: 'lb',
                            text: 'lb',
                          },
                        ],
                        type: 'select',
                      },
                      {
                        description: 'The weight of the fully assembled product. NOTE: This information is shown on the item page.',
                        filterType: 'optional',
                        id: 'assembledProductWeight.unit',
                        name: 'Assembled Product Weight > Unit',
                        options: [
                          {
                            id: 'oz',
                            text: 'oz',
                          },
                          {
                            id: 'lb',
                            text: 'lb',
                          },
                          {
                            id: 'g',
                            text: 'g',
                          },
                          {
                            id: 'kg',
                            text: 'kg',
                          },
                        ],
                        type: 'select',
                      },
                    ],
                    id: 'Dimensions',
                    isLeafNode: false,
                    name: 'Dimensions',
                    variation_attributes: [],
                  },
                  {
                    children: [],
                    fields: [
                      {
                        description: 'Attribute name corresponding to the swatch.',
                        filterType: 'conditional',
                        id: 'swatchImage.1.swatchVariantAttribute',
                        name: 'Swatch Images > Swatch Variant Attribute 1',
                        options: [],
                        type: 'select',
                      },
                      {
                        description: 'Attribute name corresponding to the swatch.',
                        filterType: 'conditional',
                        id: 'swatchImage.2.swatchVariantAttribute',
                        name: 'Swatch Images > Swatch Variant Attribute 2',
                        options: [],
                        type: 'select',
                      },
                      {
                        description: 'Attribute name corresponding to the swatch.',
                        filterType: 'conditional',
                        id: 'swatchImage.3.swatchVariantAttribute',
                        name: 'Swatch Images > Swatch Variant Attribute 3',
                        options: [],
                        type: 'select',
                      },
                      {
                        description: 'Attribute name corresponding to the swatch.',
                        filterType: 'conditional',
                        id: 'swatchImage.4.swatchVariantAttribute',
                        name: 'Swatch Images > Swatch Variant Attribute 4',
                        options: [],
                        type: 'select',
                      },
                      {
                        description: 'Attribute name corresponding to the swatch.',
                        filterType: 'conditional',
                        id: 'swatchImage.5.swatchVariantAttribute',
                        name: 'Swatch Images > Swatch Variant Attribute 5',
                        options: [],
                        type: 'select',
                      },
                    ],
                    id: 'Variation',
                    isLeafNode: false,
                    name: 'Variation',
                    variation_attributes: [],
                  },
                ],
                fields: [
                  {
                    description: 'This is a seven digit code used in Taxware that enables customers to save money on sales tax based on their state of residence and the properties of the product. To learn how to select the correct code, you may watch this video: https://vimeo.com/164512893 ',
                    filterType: 'optional',
                    id: 'ProductTaxCode',
                    name: 'Product Tax Code',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'Key features will appear as bulleted text on the item page and in search results. Key features help the user understand the benefits of the product with a simple and clean format. We highly recommended using three or more key features.',
                    filterType: 'preferred',
                    id: 'keyFeaturesValue.5',
                    name: 'Key Features 5',
                    options: [],
                    type: 'input',
                  },
                ],
                id: 'commonAttributes',
                isLeafNode: false,
                name: 'Common',
                variation_attributes: [],
              },
            ],
            initMappingData: {
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        children: [
                          {
                            children: [],
                            fieldMappings: [
                              {
                                discardIfEmpty: true,
                                extract: 'weight',
                                generate: 'ShippingWeight',
                              },
                              {
                                discardIfEmpty: true,
                                extract: 'weightunit',
                                generate: 'ShippingWeightUnit',
                              },
                            ],
                            id: 'Dimensions',
                            name: 'Dimensions',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Compliance',
                            name: 'Compliance',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Images',
                            name: 'Images',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Offer',
                            name: 'Offer',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Variation',
                            name: 'Variation',
                          },
                        ],
                        fieldMappings: [
                          {
                            discardIfEmpty: true,
                            extract: 'upccode',
                            generate: 'UPC',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'displayname',
                            generate: 'productName',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'salesdescription',
                            generate: 'shortDescription',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'manufacturer',
                            generate: 'brand',
                          },
                        ],
                        id: 'commonAttributes',
                        lookups: [],
                        name: 'Common',
                      },
                      {
                        children: [
                          {
                            children: [],
                            fieldMappings: [
                              {
                                discardIfEmpty: true,
                                extract: 'hits',
                                generate: 'globalBrandLicenseValue.1',
                              },
                            ],
                            id: 'AnimalAccessories',
                            name: 'Animal Accessories',
                          },
                        ],
                        fieldMappings: [
                          {
                            discardIfEmpty: true,
                            extract: 'hits',
                            generate: 'animalType',
                          },
                        ],
                        id: 'Animal',
                        lookups: [],
                        name: 'Animal',
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [
                      {
                        children: [],
                        fieldMappings: [],
                        id: 'Animal',
                      },
                      {
                        children: [],
                        fieldMappings: [],
                        id: 'ArtAndCraftCategory',
                      },
                    ],
                  },
                },
              },
              operation: 'mappingData',
            },
          },
        });
      });
    });

    describe('integrationApps settings submitComplete action', () => {
      test('should not affect the existing state when  update function  is called', () => {
        const state = reducer(
          { '1-2': { submitComplete: false } },
          actions.integrationApp.settings.submitComplete({
            integrationId: 'integrationId',
            flowId: 'flowId',
          })
        );
        const expectedValue = {

          '1-2': { submitComplete: false },
          'integrationId-flowId': { formSaveStatus: 'complete' },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the key by integrationId and flowId passed and set submitComplete flag to true', () => {
        const state = reducer(
          { 'integrationId-flowId': { formSaveStatus: 'loading' } },
          actions.integrationApp.settings.submitComplete({
            integrationId: 'integrationId',
            flowId: 'flowId',
          })
        );
        const expectedValue = {

          'integrationId-flowId': { formSaveStatus: 'complete' },

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps settings clear action', () => {
      test('should not affect the existing state when  update function  is called', () => {
        const state = reducer(
          {
            '1-2': { submitComplete: true },
            'integrationId-flowId': { submitComplete: true },
          },
          actions.integrationApp.settings.clear('integrationId', 'flowId')
        );
        const expectedValue = {
          '1-2': { submitComplete: true },
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the key by integrationId and flowId passed and remove that key from store', () => {
        const state = reducer(
          { 'integrationId-flowId': { submitComplete: true } },
          actions.integrationApp.settings.clear('integrationId', 'flowId')
        );
        const expectedValue = {};

        expect(state).toEqual(expectedValue);
      });

      test('should not throw error if the key is not found', () => {
        const state = reducer(
          { 'integrationId-flowId': { submitComplete: true } },
          actions.integrationApp.settings.clear(
            'incorrect_integrationId',
            'flowId'
          )
        );
        const expectedValue = {
          'integrationId-flowId': { submitComplete: true },
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps settings categoryMappings saveVariationMappings action', () => {
      test('should not affect existing state when action is called and state should not change if mapping with that id is not initialized', () => {
        const state = {
          'flow1-integration1': {
            dummy: 'value',
          },
        };

        expect(reducer(state, actions.integrationApp.settings.categoryMappings.saveVariationMappings('integrationId', 'flowId', 'variation', {}))).toEqual(
          {
            'flow1-integration1': {
              dummy: 'value',
            },
          });
      });

      test('should save the variation mappings correctly', () => {
        let state = {
          'flow1-integration1': {
            dummy: 'value',
          },
        };

        state = reducer(state, actions.integrationApp.settings.receivedCategoryMappingMetadata('integrationId', 'flowId', amazonCategoryMappings));
        state = reducer(state, actions.integrationApp.settings.categoryMappings.init({
          depth: '1',
          flowId: 'flowId',
          id: 'flowId-autoaccessorymisc-itempackagequantity',
          integrationId: 'integrationId',
          isVariationAttributes: false,
          isVariationMapping: true,
          sectionId: 'autoaccessorymisc',
          variation: 'itempackagequantity',
        }));
        state['flowId-integrationId'].mappings['flowId-autoaccessorymisc-itempackagequantity'].mappings = [{
          extract: 'yes',
          generate: 'no',
        }];
        state['flowId-integrationId'].mappings['flowId-autoaccessorymisc-itempackagequantity'].lookups = [{
          lookupName: 'yes',
          map: {yes: 'no'},
        }];
        state = reducer(state, actions.integrationApp.settings.categoryMappings.saveVariationMappings(
          'integrationId',
          'flowId',
          'flowId-autoaccessorymisc-itempackagequantity',
          {
            categoryId: 'autoaccessory',
            isVariationAttributes: false,
            subCategoryId: 'autoaccessorymisc',
          }
        ));
        expect(state).toEqual({
          'flow1-integration1': {
            dummy: 'value',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: false,
                required: true,
              },
              mappingFilter: 'all',
            },
            generatesMetadata: [
              {
                children: [

                ],
                fields: [
                  {
                    description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                    filterType: 'required',
                    id: 'item_sku',
                    name: 'Seller SKU',
                    options: [

                    ],
                    type: 'input',
                  },
                  {
                    description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
                    filterType: 'required',
                    id: 'item_name',
                    name: 'Product Name',
                    options: [

                    ],
                    type: 'input',
                  },
                  {
                    description: 'A standard, alphanumeric string that uniquely identifies the product.',
                    filterType: 'preferred',
                    id: 'ASIN',
                    name: 'ASIN',
                    options: [

                    ],
                    type: 'input',
                  },
                  {
                    description: 'A standard, alphanumeric string that uniquely identifies the product.',
                    filterType: 'preferred',
                    id: 'UPC',
                    name: 'UPC',
                    options: [

                    ],
                    type: 'input',
                  },
                  {
                    description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
                    filterType: 'optional',
                    id: 'item_length_unit_of_measure',
                    name: 'Item Length Unit Of Measure',
                    options: [
                      {
                        id: 'CM',
                        text: 'CM',
                      },
                      {
                        id: 'FT',
                        text: 'FT',
                      },
                      {
                        id: 'IN',
                        text: 'IN',
                      },
                      {
                        id: 'M',
                        text: 'M',
                      },
                      {
                        id: 'MM',
                        text: 'MM',
                      },
                    ],
                    type: 'select',
                  },
                ],
                id: 'commonAttributes',
                isLeafNode: false,
                marketplace_domain: 'US',
                name: 'Common',
                variation_attributes: [

                ],
                variation_themes: [

                ],
              },
            ],
            initMappingData: {
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        children: [
                          {
                            children: [

                            ],
                            fieldMappings: [

                            ],
                            id: 'Dimensions',
                            name: 'Dimensions',
                          },
                          {
                            children: [

                            ],
                            fieldMappings: [

                            ],
                            id: 'Discovery',
                            name: 'Discovery',
                          },
                          {
                            children: [

                            ],
                            fieldMappings: [

                            ],
                            id: 'Images',
                            name: 'Images',
                          },
                          {
                            children: [

                            ],
                            fieldMappings: [

                            ],
                            id: 'Fulfillment',
                            name: 'Fulfillment',
                          },
                        ],
                        fieldMappings: [
                          {
                            discardIfEmpty: true,
                            extract: 'SKU',
                            generate: 'item_sku',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'upccode',
                            generate: 'UPC',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'salesdescription',
                            generate: 'product_description',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'displayname',
                            generate: 'item_name',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'manufacturer',
                            generate: 'brand_name',
                          },
                        ],
                        id: 'commonAttributes',
                        lookups: [

                        ],
                        name: 'Common',
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [

                    ],
                  },
                },
              },
              operation: 'mappingData',
            },
            mappings: {
              'flowId-autoaccessorymisc-itempackagequantity': {
                lookups: [
                  {
                    lookupName: 'yes',
                    map: {
                      yes: 'no',
                    },
                  },
                ],
                mappings: [
                  {
                    extract: 'yes',
                    generate: 'no',
                  },
                ],
                staged: [
                  {
                    extract: 'yes',
                    generate: 'no',
                  },
                ],
                stagedLookups: [
                  {
                    lookupName: 'yes',
                    map: {
                      yes: 'no',
                    },
                  },
                ],
                status: 'requested',
              },
            },
            response: [
              {
                data: {
                  mappingData: {
                    basicMappings: {
                      recordMappings: [
                        {
                          children: [

                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Dimensions',
                              name: 'Dimensions',
                            },

                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Discovery',
                              name: 'Discovery',
                            },

                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Images',
                              name: 'Images',
                            },
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Fulfillment',
                              name: 'Fulfillment',
                            },
                          ],
                          fieldMappings: [

                            {
                              discardIfEmpty: true,
                              extract: 'SKU',
                              generate: 'item_sku',
                            },

                            {
                              discardIfEmpty: true,
                              extract: 'upccode',
                              generate: 'UPC',
                            },

                            {
                              discardIfEmpty: true,
                              extract: 'salesdescription',
                              generate: 'product_description',
                            },

                            {
                              discardIfEmpty: true,
                              extract: 'displayname',
                              generate: 'item_name',
                            },

                            {
                              discardIfEmpty: true,
                              extract: 'manufacturer',
                              generate: 'brand_name',
                            },

                          ],
                          id: 'commonAttributes',
                          lookups: [

                          ],
                          name: 'Common',
                        },
                      ],
                    },
                    variationMappings: {
                      recordMappings: [
                        {
                          children: [

                            {
                              children: [],
                              id: 'autoaccessorymisc',
                              variation_themes: [],
                            },

                          ],
                          id: 'autoaccessory',
                          variation_themes: [

                          ],
                        },
                      ],
                    },
                  },
                },
                operation: 'mappingData',
              },
              {
                data: [
                  {
                    id: 'hits',
                    name: '# Times Viewed',
                    type: 'integer',
                  },
                  {
                    id: 'atpleadtime',
                    name: 'ATP Lead Time',
                    type: 'float',
                  },
                  {
                    id: 'accountingbook',
                    name: 'Accounting Book',
                    type: 'select',
                  },
                  {
                    id: 'accountingbookamortization',
                    name: 'Accounting Book Amortization Schedule',
                    type: 'select',
                  },
                  {
                    id: 'accountingbookrevrecschedule',
                    name: 'Accounting Book Rev. Rec. Schedule',
                    type: 'select',
                  },
                  {
                    id: 'custitem_celigo_ebay_list_add_fee',
                    name: 'Add Listing Fee',
                    type: 'text',
                  },
                  {
                    id: 'custitem_celigo_etail_channel',
                    name: 'eTail Channel (2)',
                    type: 'multiselect',
                  },
                ],
                operation: 'extractsMetaData',
              },
              {
                data: {
                  categoryRelationshipData: [
                    {
                      children: [
                        {
                          id: 'autoaccessorymisc',
                          isLeafNode: true,
                          name: 'autoaccessorymisc',
                        },
                        {
                          id: 'autobattery',
                          isLeafNode: true,
                          name: 'autobattery',
                        },
                        {
                          id: 'autooil',
                          isLeafNode: true,
                          name: 'autooil',
                        },
                        {
                          id: 'Underwear',
                          isLeafNode: true,
                          name: 'Underwear [Moved to Clothing]',
                        },
                      ],
                      id: 'autoaccessory',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Auto Accessory',
                    },
                    {
                      children: [
                        {
                          id: 'babyproducts',
                          isLeafNode: true,
                          name: 'babyproducts',
                        },
                        {
                          id: 'infanttoddlercarseat',
                          isLeafNode: true,
                          name: 'infanttoddlercarseat',
                        },
                        {
                          id: 'stroller',
                          isLeafNode: true,
                          name: 'stroller',
                        },
                      ],
                      id: 'baby',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Baby',
                    },
                    {
                      children: [
                        {
                          id: 'beautymisc',
                          isLeafNode: true,
                          name: 'beautymisc',
                        },
                        {
                          id: 'bodycareproduct',
                          isLeafNode: true,
                          name: 'bodycareproduct',
                        },
                        {
                          id: 'conditioner',
                          isLeafNode: true,
                          name: 'conditioner',
                        },
                      ],
                      id: 'beauty',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Beauty',
                    },
                    {
                      children: [

                      ],
                      id: 'BookLoader',
                      isLeafNode: true,
                      marketplace_domain: 'US',
                      name: 'Book Loader',
                    },
                    {
                      children: [
                        {
                          id: 'binocular',
                          isLeafNode: true,
                          name: 'binocular',
                        },
                        {
                          id: 'blankmediaforcameras',
                          isLeafNode: true,
                          name: 'blankmediaforcameras',
                        },
                        {
                          id: 'camcorder',
                          isLeafNode: true,
                          name: 'camcorder',
                        },
                        {
                          id: 'Tripod',
                          isLeafNode: true,
                          name: 'Tripod [Deprecated]',
                        },
                      ],
                      id: 'cameraandphoto',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Camera and Photo',
                    },
                    {
                      children: [
                        {
                          id: 'PROTECTIVE_GLOVE',
                          isLeafNode: true,
                          name: 'PROTECTIVE_GLOVE',
                        },
                        {
                          id: 'accessory',
                          isLeafNode: true,
                          name: 'accessory',
                        },
                        {
                          id: 'childrenscostume',
                          isLeafNode: true,
                          name: 'childrenscostume',
                        },
                        {
                          id: 'vest',
                          isLeafNode: true,
                          name: 'vest',
                        },
                      ],
                      id: 'clothing',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Clothing',
                    },
                    {
                      children: [
                        {
                          id: 'Bullion',
                          isLeafNode: true,
                          name: 'Bullion',
                        },
                        {
                          id: 'Coins',
                          isLeafNode: true,
                          name: 'Coins',
                        },
                        {
                          id: 'CollectibleCoins',
                          isLeafNode: true,
                          name: 'CollectibleCoins',
                        },
                      ],
                      id: 'coins',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Coins',
                    },
                    {
                      children: [
                        {
                          id: 'FoodServiceSupply',
                          isLeafNode: true,
                          name: 'FoodServiceSupply',
                        },
                        {
                          id: 'JanitorialSupply',
                          isLeafNode: true,
                          name: 'JanitorialSupply',
                        },
                      ],
                      id: 'FoodServiceAndJanSan',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Food Service and Jan San',
                    },
                  ],
                  generatesMetaData: {
                    children: [

                    ],
                    fields: [
                      {
                        description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                        filterType: 'required',
                        id: 'item_sku',
                        name: 'Seller SKU',
                        options: [

                        ],
                        type: 'input',
                      },
                      {
                        description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
                        filterType: 'required',
                        id: 'item_name',
                        name: 'Product Name',
                        options: [

                        ],
                        type: 'input',
                      },
                      {
                        description: 'A standard, alphanumeric string that uniquely identifies the product.',
                        filterType: 'preferred',
                        id: 'ASIN',
                        name: 'ASIN',
                        options: [

                        ],
                        type: 'input',
                      },
                      {
                        description: 'A standard, alphanumeric string that uniquely identifies the product.',
                        filterType: 'preferred',
                        id: 'UPC',
                        name: 'UPC',
                        options: [

                        ],
                        type: 'input',
                      },
                      {
                        description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
                        filterType: 'optional',
                        id: 'item_length_unit_of_measure',
                        name: 'Item Length Unit Of Measure',
                        options: [
                          {
                            id: 'CM',
                            text: 'CM',
                          },
                          {
                            id: 'FT',
                            text: 'FT',
                          },
                          {
                            id: 'IN',
                            text: 'IN',
                          },
                          {
                            id: 'M',
                            text: 'M',
                          },
                          {
                            id: 'MM',
                            text: 'MM',
                          },
                        ],
                        type: 'select',
                      },
                    ],
                    id: 'commonAttributes',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    name: 'Common',
                    variation_attributes: [

                    ],
                    variation_themes: [

                    ],
                  },
                },
                operation: 'generatesMetaData',
              },
            ],
            uiAssistant: 'amazon',
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings cancelVariationMappings action', () => {
      test('should set reset mapping and lookups with staged mappings and lookups on clear action', () => {
        let state = {
          'other-flow': {
            props: 'value',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [{
                  id: 'oldLookup',
                }],
                mappings: {
                  fields: [{
                    a: 'c',
                  }],
                },
                staged: {
                  fields: [{
                    a: 'b',
                  }, {
                    a: 'd',
                  }],
                },
                stagedLookups: [{
                  id: 'lookup1',
                }],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.cancelVariationMappings('integrationId', 'flowId', 'mappingId'));
        expect(state).toEqual({
          'other-flow': {
            props: 'value',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [{
                  id: 'lookup1',
                }],
                mappings: {
                  fields: [{
                    a: 'b',
                  }, {
                    a: 'd',
                  }],
                },
                staged: {
                  fields: [{
                    a: 'b',
                  }, {
                    a: 'd',
                  }],
                },
                stagedLookups: [{
                  id: 'lookup1',
                }],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings delete action', () => {
      test('should delete the mapping field from the specified mapping id', () => {
        let state = {
          'other-flow': {
            props: 'value',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                initChangeIdentifier: 0,
                lookups: [{
                  id: 'oldLookup',
                }],
                mappings: [
                  {
                    extract: 'a',
                    generate: 'b',
                    key: 'key0',
                  },
                  {
                    extract: 'c',
                    generate: 'd',
                    key: 'key1',
                  },
                  {
                    extract: 'e',
                    generate: 'f',
                    key: 'key2',
                  },
                ],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.delete('integrationId', 'flowId', 'mappingId', 'key0'));
        expect(state).toEqual({
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                initChangeIdentifier: 1,
                lookups: [
                  {
                    id: 'oldLookup',
                  },
                ],
                mappings: [
                  {
                    extract: 'c',
                    generate: 'd',
                    key: 'key1',
                  },
                  {
                    extract: 'e',
                    generate: 'f',
                    key: 'key2',

                  },
                ],
                validationErrMsg: undefined,
              },
            },
          },
          'other-flow': {
            props: 'value',
          },
        });
      });

      test('should delete the mapping field from the specified mapping id and should reset lastModifiedRow when it is same as row', () => {
        let state = {
          'other-flow': {
            props: 'value',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRow: 1,
                initChangeIdentifier: 0,
                lookups: [{
                  id: 'oldLookup',
                }],
                mappings: [
                  {
                    extract: 'a',
                    generate: 'b',
                    key: 'key0',
                  },
                  {
                    extract: 'c',
                    generate: 'd',
                    key: 'key1',

                  },
                  {
                    extract: 'e',
                    generate: 'f',
                    key: 'key2',

                  },
                ],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.delete('integrationId', 'flowId', 'mappingId', 'key1'));
        expect(state).toEqual({
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRow: -1,
                initChangeIdentifier: 1,
                lookups: [
                  {
                    id: 'oldLookup',
                  },
                ],
                mappings: [
                  {
                    extract: 'a',
                    generate: 'b',
                    key: 'key0',
                  },
                  {
                    extract: 'e',
                    generate: 'f',
                    key: 'key2',
                  },
                ],
                validationErrMsg: undefined,
              },
            },
          },
          'other-flow': {
            props: 'value',
          },
        });
      });

      test('should delete the mapping field from the specified mapping id and set error messages if any mappings are invalid', () => {
        let state = {
          'other-flow': {
            props: 'value',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRow: 1,
                initChangeIdentifier: 0,
                lookups: [{
                  id: 'oldLookup',
                }],
                mappings: [
                  {
                    extract: 'a',
                    key: 'key0',
                  },
                  {
                    extract: 'c',
                    generate: 'd',
                    key: 'key1',
                  },
                  {
                    extract: 'e',
                    generate: 'f',
                    key: 'key2',
                  },
                ],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.delete('integrationId', 'flowId', 'mappingId', 'key1'));
        expect(state).toEqual({
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRow: -1,
                initChangeIdentifier: 1,
                lookups: [
                  {
                    id: 'oldLookup',
                  },
                ],
                mappings: [
                  {
                    extract: 'a',
                    key: 'key0',
                  },
                  {
                    extract: 'e',
                    generate: 'f',
                    key: 'key2',
                  },
                ],
                validationErrMsg: 'One or more generate fields missing',
              },
            },
          },
          'other-flow': {
            props: 'value',
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings clear action', () => {
      test('should clear the categoryMappings settings and should not affect other settings', () => {
        let state = {
          'other-flow': {
            props: 'value',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [{
                  id: 'oldLookup',
                }],
                mappings: {
                  fields: [{
                    a: 'c',
                  }],
                },
                staged: {
                  fields: [{
                    a: 'b',
                  }, {
                    a: 'd',
                  }],
                },
                stagedLookups: [{
                  id: 'lookup1',
                }],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.clear('integrationId', 'flowId'));
        expect(state).toEqual({
          'other-flow': {
            props: 'value',
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings clear Save status action', () => {
      test('should clear the categoryMappings settings saveStatus and should not affect other settings', () => {
        let state = {
          'other-flow': {
            props: 'value',
          },
          'flowId-integrationId': {
            saveStatus: 'saved',
            mappings: {
              mappingId: {
                lookups: [{
                  id: 'oldLookup',
                }],
                mappings: {
                  fields: [{
                    a: 'c',
                  }],
                },
                staged: {
                  fields: [{
                    a: 'b',
                  }, {
                    a: 'd',
                  }],
                },
                stagedLookups: [{
                  id: 'lookup1',
                }],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.clearSaveStatus('integrationId', 'flowId'));
        expect(state).toEqual({
          'other-flow': {
            props: 'value',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [{
                  id: 'oldLookup',
                }],
                mappings: {
                  fields: [{
                    a: 'c',
                  }],
                },
                staged: {
                  fields: [{
                    a: 'b',
                  }, {
                    a: 'd',
                  }],
                },
                stagedLookups: [{
                  id: 'lookup1',
                }],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings init action', () => {
      test('should correctly set the mappings init object', () => {
        let state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integrationId', 'flowId', amazonCategoryMappings));

        state = reducer(state, actions.integrationApp.settings.categoryMappings.init({
          depth: '1',
          flowId: 'flowId',
          id: 'flowId-autoaccessorymisc-itempackagequantity',
          integrationId: 'integrationId',
          sectionId: 'autoaccessorymisc',
        }));

        expect(state['flowId-integrationId'].mappings).toEqual({
          'flowId-autoaccessorymisc-itempackagequantity': {
            status: 'requested',
          },
        });
      });

      test('should correctly set the mappings init object for variation mappings', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            collapseStatus: {
              collapseAction: 'collapse',
              collapseStatus: 'collapsed',
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.init({
          depth: '1',
          flowId: 'flowId',
          id: 'flowId-autoaccessorymisc-itempackagequantity',
          integrationId: 'integrationId',
          isVariationAttributes: false,
          isVariationMapping: true,
          sectionId: 'autoaccessorymisc',
          variation: 'itempackagequantity',
        }));

        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            collapseStatus: {
              collapseAction: 'collapse',
              collapseStatus: 'collapsed',
            },
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            mappings: {
              'flowId-autoaccessorymisc-itempackagequantity': {
                status: 'requested',
              },
              mappingId: {
                lookups: [

                ],
                mappings: [

                ],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings updateGenerates action', () => {
      test('should update the specific mapping in the category mappings with updated generateFields', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {

              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.updateGenerates('integrationId', 'flowId', 'mappingId', [{a: 'b'}]));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                generateFields: [{a: 'b'}],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings mapping patchField action', () => {
      test('should update the specific mapping in the category mappings with field patch for generate and index not found', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                mappings: [{key: 'key1'}],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.patchField('integrationId', 'flowId', 'mappingId', 'generate', 'key1', 'value'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRowKey: 'key1',
                mappings: [{
                  key: 'key1',
                  generate: 'value',
                }],
                validationErrMsg: 'Extract Fields missing for field(s): value',
              },
            },
          },
        });
      });

      test('should update the specific mapping in the category mappings with field patch for generate', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                mappings: [{
                  extract: 'hello',
                  generate: 'world',
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'world1',
                  key: 'key1',
                }],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.patchField('integrationId', 'flowId', 'mappingId', 'generate', 'key1', 'value'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRowKey: 'key1',
                mappings: [{
                  extract: 'hello',
                  generate: 'world',
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'value',
                  key: 'key1',
                }],
                validationErrMsg: undefined,
              },
            },
          },
        });
      });
      test('should update the specific mapping in the category mappings with field patch for extract', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                mappings: [{
                  hardCodedValue: 'hello',
                  generate: 'world',
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'world1',
                  key: 'key1',
                }],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.patchField('integrationId', 'flowId', 'mappingId', 'extract', 'key0', 'value'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRowKey: 'key0',
                mappings: [{
                  extract: 'value',
                  generate: 'world',
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'world1',
                  key: 'key1',
                }],
                validationErrMsg: undefined,
              },
            },
          },
        });
      });

      test('should update the specific mapping in the category mappings with field patch hardcoded value for extract', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                mappings: [{
                  extract: 'hello',
                  generate: 'world',
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'world1',
                  key: 'key1',
                }],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.patchField('integrationId', 'flowId', 'mappingId', 'extract', 'key1', '"value"'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRowKey: 'key1',
                mappings: [{
                  extract: 'hello',
                  generate: 'world',
                  key: 'key0',
                }, {
                  hardCodedValue: 'value',
                  generate: 'world1',
                  key: 'key1',
                }],
                validationErrMsg: undefined,
              },
            },
          },
        });
      });

      test('should update the specific mapping in the category mappings with field patch for generate and throw validation messages', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                mappings: [{
                  generate: 'world',
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'world1',
                  key: 'key1',
                }],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.patchField('integrationId', 'flowId', 'mappingId', 'generate', 'key1', 'value'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRowKey: 'key1',
                mappings: [{
                  generate: 'world',
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'value',
                  key: 'key1',
                }],
                validationErrMsg: 'Extract Fields missing for field(s): world',
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings mapping patchSettings action', () => {
      test('should update the specific mapping in the category mappings with settings patch for generate and index not found', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.patchSettings('integrationId', 'flowId', 'mappingId', 0, 'value'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                mappings: [],
              },
            },
          },
        });
      });

      test('should update the specific mapping in the category mappings with settings patch', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                mappings: [{
                  extract: 'hello',
                  generate: 'world',
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'world1',
                  key: 'key1',
                }],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.patchSettings('integrationId', 'flowId', 'mappingId', 'key1', {
          dataType: 'number',
          discardIfEmpty: true,
          extract: 'manufacturer',
          generate: 'manufacturer',
          immutable: false,
          useAsAnInitializeValue: false,
        }));

        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRowKey: 'key1',
                mappings: [{
                  extract: 'hello',
                  generate: 'world',
                  key: 'key0',
                }, {
                  dataType: 'number',
                  discardIfEmpty: true,
                  extract: 'manufacturer',
                  generate: 'manufacturer',
                  immutable: false,
                  useAsAnInitializeValue: false,
                  key: 'key1',
                }],
                validationErrMsg: undefined,
              },
            },
          },
        });
      });
      test('should update the specific mapping in the category mappings with settings patch for hardcodedvalue', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                mappings: [{
                  hardCodedValue: 'hello',
                  generate: 'world',
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'world1',
                  key: 'key1',
                }],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.patchSettings('integrationId', 'flowId', 'mappingId', 'key0', {
          discardIfEmpty: true,
          generate: 'item_sku',
          hardCodedValue: 'fghjkl',
          immutable: false,
          useAsAnInitializeValue: false,
        }));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lastModifiedRowKey: 'key0',
                mappings: [{
                  discardIfEmpty: true,
                  generate: 'item_sku',
                  hardCodedValue: 'fghjkl',
                  immutable: false,
                  useAsAnInitializeValue: false,
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'world1',
                  key: 'key1',
                }],
                validationErrMsg: undefined,
              },
            },
          },
        });
      });

      test('should update the specific mapping in the category mappings with patch settings for static lookup', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [{
                  extract: 'hello',
                  generate: 'world',
                  key: 'key0',
                }, {
                  extract: 'hello1',
                  generate: 'world1',
                  key: 'key1',
                }],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.patchSettings('integrationId', 'flowId', 'mappingId', 'key1', {
          discardIfEmpty: true,
          extract: undefined,
          generate: 'item_sku',
          immutable: false,
          lookupName: 'SJ4yXwtIe',
          useAsAnInitializeValue: false,
        }));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                lastModifiedRowKey: 'key1',
                mappings: [{
                  extract: 'hello',
                  generate: 'world',
                  key: 'key0',
                }, {
                  discardIfEmpty: true,
                  extract: undefined,
                  generate: 'item_sku',
                  immutable: false,
                  lookupName: 'SJ4yXwtIe',
                  useAsAnInitializeValue: false,
                  key: 'key1',
                }],
                validationErrMsg: 'Extract Fields missing for field(s): item_sku',
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings mapping updateLookup action', () => {
      test('should update the specific mapping in the category mappings with updateLookup for new lookups', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.updateLookup('integrationId', 'flowId', 'mappingId', undefined, {
          name: 'xyz',
          map: {a: 'b'},
          allowFailures: false,
        }));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [{
                  allowFailures: false,
                  map: {
                    a: 'b',
                  },
                  name: 'xyz',
                }],
                validationErrMsg: undefined,
                mappings: [],
              },
            },
          },
        });
      });

      test('should update the specific mapping in the category mappings with updateLookup for existing lookups', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [{
                  name: 'xyz',
                  map: {
                    a: 'b',
                  },
                  allowFailures: false,
                }],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.updateLookup('integrationId', 'flowId', 'mappingId',
          {
            name: 'xyz',
            map: {
              a: 'b',
            },
            allowFailures: false,
          },
          {
            name: 'xyz',
            map: {
              a: 'b',
              c: 'dd',
            },
            allowFailures: false,
          }));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [{
                  allowFailures: false,
                  map: {
                    a: 'b',
                    c: 'dd',
                  },
                  name: 'xyz',
                }],
                validationErrMsg: undefined,
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings mapping setVisibility action', () => {
      test('should set correctly the visibility property on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.setVisibility('integrationId', 'flowId', 'mappingId', true));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
                visible: true,
              },
            },
          },
        });
        state = reducer(state, actions.integrationApp.settings.categoryMappings.setVisibility('integrationId', 'flowId', 'mappingId', false));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
                visible: false,
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings mapping save action', () => {
      test('should set correctly the closeOnSave and status property on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.save('integrationId', 'flowId', true));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            closeOnSave: true,
            saveStatus: 'requested',
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });

      test('should set correctly the closeOnSave and status property on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.save('integrationId', 'flowId', false));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            saveStatus: 'requested',
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });
    describe('integrationApps settings categoryMappings mapping saveComplete action', () => {
      test('should set correctly the closeOnSave and status property on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.saveComplete('integrationId', 'flowId', 'mappingId'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            saveStatus: 'saved',
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });

      test('should set correctly the closeOnSave and status property on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            closeOnSave: true,
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.saveComplete('integrationId', 'flowId', false));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            saveStatus: 'close',
            closeOnSave: true,
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings mapping saveComplete action', () => {
      test('should set correctly the closeOnSave and status property on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.saveFailed('integrationId', 'flowId', 'mappingId'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            saveStatus: 'failed',
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings mapping loadFailed action', () => {
      test('should not change the state', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.loadFailed('integrationId', 'flowId', 'mappingId'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings receivedGeneratesMetadata action', () => {
      test('should read the metadata response and set appropriately on the state if not already present', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.receivedGeneratesMetadata('integrationId', 'flowId', {
          uiAssistant: 'amazon',
          response: [{
            operation: 'generatesMetaData',
            data: {
              generatesMetaData: {
                id: 'BookLoader',
                name: 'Book Loader',
                variation_themes: [],
                variation_attributes: [],
                children: [
                  {
                    id: 'Books',
                    name: 'Books',
                    variation_themes: [],
                    variation_attributes: [],
                    children: [],
                    fields: [{
                      id: 'field1',
                      name: 'Field1',
                      type: 'input',
                    }, {
                      id: 'field2',
                      name: 'Field2',
                      type: 'input',
                    }],
                    isLeafNode: true,
                  },
                  {
                    id: 'Automation',
                    name: 'Automation',
                    variation_themes: [],
                    variation_attributes: [],
                    children: [],
                    fields: [{
                      id: 'field3',
                      name: 'Field3',
                      type: 'input',
                    }, {
                      id: 'field4',
                      name: 'Field4',
                      type: 'input',
                    }],
                    isLeafNode: true,
                  },
                ],
                fields: [{
                  id: 'field5',
                  name: 'Field5',
                  type: 'input',
                }, {
                  id: 'field6',
                  name: 'Field6',
                  type: 'input',
                }],
                isLeafNode: true,
              },
            },
          }],
        }));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            generatesMetadata: [
              {
                children: [
                  {
                    children: [],
                    fields: [
                      {
                        id: 'field1',
                        name: 'Field1',
                        type: 'input',
                      },
                      {
                        id: 'field2',
                        name: 'Field2',
                        type: 'input',
                      },
                    ],
                    id: 'Books',
                    isLeafNode: true,
                    name: 'Books',
                    variation_attributes: [],
                    variation_themes: [],
                  },
                  {
                    children: [],
                    fields: [
                      {
                        id: 'field3',
                        name: 'Field3',
                        type: 'input',
                      },
                      {
                        id: 'field4',
                        name: 'Field4',
                        type: 'input',
                      },
                    ],
                    id: 'Automation',
                    isLeafNode: true,
                    name: 'Automation',
                    variation_attributes: [],
                    variation_themes: [],
                  },
                ],
                fields: [
                  {
                    id: 'field5',
                    name: 'Field5',
                    type: 'input',
                  },
                  {
                    id: 'field6',
                    name: 'Field6',
                    type: 'input',
                  },
                ],
                id: 'BookLoader',
                isLeafNode: true,
                name: 'Book Loader',
                variation_attributes: [],
                variation_themes: [],
              },
            ],
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });

      test('should read the metadata response and ignore the response if already present', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            generatesMetadata: [
              {
                children: [
                  {
                    children: [],
                    fields: [
                      {
                        id: 'field1',
                        name: 'Field1',
                        type: 'input',
                      },
                      {
                        id: 'field2',
                        name: 'Field2',
                        type: 'input',
                      },
                    ],
                    id: 'Books',
                    isLeafNode: true,
                    name: 'Books',
                    variation_attributes: [],
                    variation_themes: [],
                  },
                  {
                    children: [],
                    fields: [
                      {
                        id: 'field3',
                        name: 'Field3',
                        type: 'input',
                      },
                      {
                        id: 'field4',
                        name: 'Field4',
                        type: 'input',
                      },
                    ],
                    id: 'Automation',
                    isLeafNode: true,
                    name: 'Automation',
                    variation_attributes: [],
                    variation_themes: [],
                  },
                ],
                fields: [
                  {
                    id: 'field5',
                    name: 'Field5',
                    type: 'input',
                  },
                  {
                    id: 'field6',
                    name: 'Field6',
                    type: 'input',
                  },
                ],
                id: 'BookLoader',
                isLeafNode: true,
                name: 'Book Loader',
                variation_attributes: [],
                variation_themes: [],
              },
            ],
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.receivedGeneratesMetadata('integrationId', 'flowId', {
          uiAssistant: 'amazon',
          response: [{
            operation: 'generatesMetaData',
            data: {
              generatesMetaData: {
                id: 'BookLoader',
                name: 'Book Loader',
                variation_themes: [],
                variation_attributes: [],
                children: [],
                fields: [{
                  id: 'field5',
                  name: 'Field5',
                  type: 'input',
                }, {
                  id: 'field6',
                  name: 'Field6',
                  type: 'input',
                }],
                isLeafNode: true,
              },
            },
          }],
        }));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            generatesMetadata: [
              {
                children: [
                  {
                    children: [],
                    fields: [
                      {
                        id: 'field1',
                        name: 'Field1',
                        type: 'input',
                      },
                      {
                        id: 'field2',
                        name: 'Field2',
                        type: 'input',
                      },
                    ],
                    id: 'Books',
                    isLeafNode: true,
                    name: 'Books',
                    variation_attributes: [],
                    variation_themes: [],
                  },
                  {
                    children: [],
                    fields: [
                      {
                        id: 'field3',
                        name: 'Field3',
                        type: 'input',
                      },
                      {
                        id: 'field4',
                        name: 'Field4',
                        type: 'input',
                      },
                    ],
                    id: 'Automation',
                    isLeafNode: true,
                    name: 'Automation',
                    variation_attributes: [],
                    variation_themes: [],
                  },
                ],
                fields: [
                  {
                    id: 'field5',
                    name: 'Field5',
                    type: 'input',
                  },
                  {
                    id: 'field6',
                    name: 'Field6',
                    type: 'input',
                  },
                ],
                id: 'BookLoader',
                isLeafNode: true,
                name: 'Book Loader',
                variation_attributes: [],
                variation_themes: [],
              },
            ],
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings setFilters action', () => {
      test('should set correctly the filters property on mapping for attribute filters', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.setFilters('integrationId', 'flowId', {
          attributes: {
            conditional: false,
            optional: false,
            preferred: true,
            required: true,
          },
        }));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });

      test('should set correctly the filters property on mapping for attribute filters', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.setFilters('integrationId', 'flowId', {
          mappingFilter: 'mapped',
        }));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
              mappingFilter: 'mapped',
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings addCategory action', () => {
      test('should add correctly the category details on mapping for parent category', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
        };

        state = reducer(state, actions.integrationApp.settings.receivedCategoryMappingMetadata('integrationId', 'flowId', amazonCategoryMappings));
        state = reducer(state, actions.integrationApp.settings.categoryMappings.addCategory('integrationId', 'flowId', {
          category: 'baby',
          childCategory: 'babyproducts',
          grandChildCategory: undefined,
        }));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: false,
                required: true,
              },
              mappingFilter: 'all',
            },
            generatesMetadata: [
              {
                children: [],
                fields: [
                  {
                    description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                    filterType: 'required',
                    id: 'item_sku',
                    name: 'Seller SKU',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
                    filterType: 'required',
                    id: 'item_name',
                    name: 'Product Name',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'A standard, alphanumeric string that uniquely identifies the product.',
                    filterType: 'preferred',
                    id: 'ASIN',
                    name: 'ASIN',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'A standard, alphanumeric string that uniquely identifies the product.',
                    filterType: 'preferred',
                    id: 'UPC',
                    name: 'UPC',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
                    filterType: 'optional',
                    id: 'item_length_unit_of_measure',
                    name: 'Item Length Unit Of Measure',
                    options: [
                      {
                        id: 'CM',
                        text: 'CM',
                      },
                      {
                        id: 'FT',
                        text: 'FT',
                      },
                      {
                        id: 'IN',
                        text: 'IN',
                      },
                      {
                        id: 'M',
                        text: 'M',
                      },
                      {
                        id: 'MM',
                        text: 'MM',
                      },
                    ],
                    type: 'select',
                  },
                ],
                id: 'commonAttributes',
                isLeafNode: false,
                marketplace_domain: 'US',
                name: 'Common',
                variation_attributes: [],
                variation_themes: [],
              },
            ],
            initMappingData: {
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        children: [
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Dimensions',
                            name: 'Dimensions',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Discovery',
                            name: 'Discovery',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Images',
                            name: 'Images',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Fulfillment',
                            name: 'Fulfillment',
                          },
                        ],
                        fieldMappings: [
                          {
                            discardIfEmpty: true,
                            extract: 'SKU',
                            generate: 'item_sku',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'upccode',
                            generate: 'UPC',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'salesdescription',
                            generate: 'product_description',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'displayname',
                            generate: 'item_name',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'manufacturer',
                            generate: 'brand_name',
                          },
                        ],
                        id: 'commonAttributes',
                        lookups: [],
                        name: 'Common',
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [],
                  },
                },
              },
              operation: 'mappingData',
            },
            response: [
              {
                data: {
                  mappingData: {
                    basicMappings: {
                      recordMappings: [
                        {
                          children: [
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Dimensions',
                              name: 'Dimensions',
                            },
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Discovery',
                              name: 'Discovery',
                            },
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Images',
                              name: 'Images',
                            },
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Fulfillment',
                              name: 'Fulfillment',
                            },
                          ],
                          fieldMappings: [
                            {
                              discardIfEmpty: true,
                              extract: 'SKU',
                              generate: 'item_sku',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'upccode',
                              generate: 'UPC',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'salesdescription',
                              generate: 'product_description',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'displayname',
                              generate: 'item_name',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'manufacturer',
                              generate: 'brand_name',
                            },
                          ],
                          id: 'commonAttributes',
                          lookups: [],
                          name: 'Common',
                        },
                        {
                          children: [
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'babyproducts',
                              name: 'babyproducts',
                            },
                          ],
                          fieldMappings: [],
                          id: 'baby',
                          name: 'Baby',
                        },
                      ],
                    },
                    variationMappings: {
                      recordMappings: [],
                    },
                  },
                },
                operation: 'mappingData',
              },
              {
                data: [
                  {
                    id: 'hits',
                    name: '# Times Viewed',
                    type: 'integer',
                  },
                  {
                    id: 'atpleadtime',
                    name: 'ATP Lead Time',
                    type: 'float',
                  },
                  {
                    id: 'accountingbook',
                    name: 'Accounting Book',
                    type: 'select',
                  },
                  {
                    id: 'accountingbookamortization',
                    name: 'Accounting Book Amortization Schedule',
                    type: 'select',
                  },
                  {
                    id: 'accountingbookrevrecschedule',
                    name: 'Accounting Book Rev. Rec. Schedule',
                    type: 'select',
                  },
                  {
                    id: 'custitem_celigo_ebay_list_add_fee',
                    name: 'Add Listing Fee',
                    type: 'text',
                  },
                  {
                    id: 'custitem_celigo_etail_channel',
                    name: 'eTail Channel (2)',
                    type: 'multiselect',
                  },
                ],
                operation: 'extractsMetaData',
              },
              {
                data: {
                  categoryRelationshipData: [
                    {
                      children: [
                        {
                          id: 'autoaccessorymisc',
                          isLeafNode: true,
                          name: 'autoaccessorymisc',
                        },
                        {
                          id: 'autobattery',
                          isLeafNode: true,
                          name: 'autobattery',
                        },
                        {
                          id: 'autooil',
                          isLeafNode: true,
                          name: 'autooil',
                        },
                        {
                          id: 'Underwear',
                          isLeafNode: true,
                          name: 'Underwear [Moved to Clothing]',
                        },
                      ],
                      id: 'autoaccessory',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Auto Accessory',
                    },
                    {
                      children: [
                        {
                          id: 'babyproducts',
                          isLeafNode: true,
                          name: 'babyproducts',
                        },
                        {
                          id: 'infanttoddlercarseat',
                          isLeafNode: true,
                          name: 'infanttoddlercarseat',
                        },
                        {
                          id: 'stroller',
                          isLeafNode: true,
                          name: 'stroller',
                        },
                      ],
                      id: 'baby',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Baby',
                    },
                    {
                      children: [
                        {
                          id: 'beautymisc',
                          isLeafNode: true,
                          name: 'beautymisc',
                        },
                        {
                          id: 'bodycareproduct',
                          isLeafNode: true,
                          name: 'bodycareproduct',
                        },
                        {
                          id: 'conditioner',
                          isLeafNode: true,
                          name: 'conditioner',
                        },
                      ],
                      id: 'beauty',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Beauty',
                    },
                    {
                      children: [],
                      id: 'BookLoader',
                      isLeafNode: true,
                      marketplace_domain: 'US',
                      name: 'Book Loader',
                    },
                    {
                      children: [
                        {
                          id: 'binocular',
                          isLeafNode: true,
                          name: 'binocular',
                        },
                        {
                          id: 'blankmediaforcameras',
                          isLeafNode: true,
                          name: 'blankmediaforcameras',
                        },
                        {
                          id: 'camcorder',
                          isLeafNode: true,
                          name: 'camcorder',
                        },
                        {
                          id: 'Tripod',
                          isLeafNode: true,
                          name: 'Tripod [Deprecated]',
                        },
                      ],
                      id: 'cameraandphoto',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Camera and Photo',
                    },
                    {
                      children: [
                        {
                          id: 'PROTECTIVE_GLOVE',
                          isLeafNode: true,
                          name: 'PROTECTIVE_GLOVE',
                        },
                        {
                          id: 'accessory',
                          isLeafNode: true,
                          name: 'accessory',
                        },
                        {
                          id: 'childrenscostume',
                          isLeafNode: true,
                          name: 'childrenscostume',
                        },
                        {
                          id: 'vest',
                          isLeafNode: true,
                          name: 'vest',
                        },
                      ],
                      id: 'clothing',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Clothing',
                    },
                    {
                      children: [
                        {
                          id: 'Bullion',
                          isLeafNode: true,
                          name: 'Bullion',
                        },
                        {
                          id: 'Coins',
                          isLeafNode: true,
                          name: 'Coins',
                        },
                        {
                          id: 'CollectibleCoins',
                          isLeafNode: true,
                          name: 'CollectibleCoins',
                        },
                      ],
                      id: 'coins',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Coins',
                    },
                    {
                      children: [
                        {
                          id: 'FoodServiceSupply',
                          isLeafNode: true,
                          name: 'FoodServiceSupply',
                        },
                        {
                          id: 'JanitorialSupply',
                          isLeafNode: true,
                          name: 'JanitorialSupply',
                        },
                      ],
                      id: 'FoodServiceAndJanSan',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Food Service and Jan San',
                    },
                  ],
                  generatesMetaData: {
                    children: [],
                    fields: [
                      {
                        description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                        filterType: 'required',
                        id: 'item_sku',
                        name: 'Seller SKU',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
                        filterType: 'required',
                        id: 'item_name',
                        name: 'Product Name',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'A standard, alphanumeric string that uniquely identifies the product.',
                        filterType: 'preferred',
                        id: 'ASIN',
                        name: 'ASIN',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'A standard, alphanumeric string that uniquely identifies the product.',
                        filterType: 'preferred',
                        id: 'UPC',
                        name: 'UPC',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
                        filterType: 'optional',
                        id: 'item_length_unit_of_measure',
                        name: 'Item Length Unit Of Measure',
                        options: [
                          {
                            id: 'CM',
                            text: 'CM',
                          },
                          {
                            id: 'FT',
                            text: 'FT',
                          },
                          {
                            id: 'IN',
                            text: 'IN',
                          },
                          {
                            id: 'M',
                            text: 'M',
                          },
                          {
                            id: 'MM',
                            text: 'MM',
                          },
                        ],
                        type: 'select',
                      },
                    ],
                    id: 'commonAttributes',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    name: 'Common',
                    variation_attributes: [],
                    variation_themes: [],
                  },
                },
                operation: 'generatesMetaData',
              },
            ],
            uiAssistant: 'amazon',
          },
        });
      });

      test('should add correctly the category details on mapping for parent category and child category', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
        };

        state = reducer(state, actions.integrationApp.settings.receivedCategoryMappingMetadata('integrationId', 'flowId', amazonCategoryMappings));
        state = reducer(state, actions.integrationApp.settings.categoryMappings.addCategory('integrationId', 'flowId', {
          category: 'baby',
          childCategory: undefined,
          grandChildCategory: undefined,
        }));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: false,
                required: true,
              },
              mappingFilter: 'all',
            },
            generatesMetadata: [
              {
                children: [],
                fields: [
                  {
                    description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                    filterType: 'required',
                    id: 'item_sku',
                    name: 'Seller SKU',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
                    filterType: 'required',
                    id: 'item_name',
                    name: 'Product Name',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'A standard, alphanumeric string that uniquely identifies the product.',
                    filterType: 'preferred',
                    id: 'ASIN',
                    name: 'ASIN',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'A standard, alphanumeric string that uniquely identifies the product.',
                    filterType: 'preferred',
                    id: 'UPC',
                    name: 'UPC',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
                    filterType: 'optional',
                    id: 'item_length_unit_of_measure',
                    name: 'Item Length Unit Of Measure',
                    options: [
                      {
                        id: 'CM',
                        text: 'CM',
                      },
                      {
                        id: 'FT',
                        text: 'FT',
                      },
                      {
                        id: 'IN',
                        text: 'IN',
                      },
                      {
                        id: 'M',
                        text: 'M',
                      },
                      {
                        id: 'MM',
                        text: 'MM',
                      },
                    ],
                    type: 'select',
                  },
                ],
                id: 'commonAttributes',
                isLeafNode: false,
                marketplace_domain: 'US',
                name: 'Common',
                variation_attributes: [],
                variation_themes: [],
              },
            ],
            initMappingData: {
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        children: [
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Dimensions',
                            name: 'Dimensions',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Discovery',
                            name: 'Discovery',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Images',
                            name: 'Images',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Fulfillment',
                            name: 'Fulfillment',
                          },
                        ],
                        fieldMappings: [
                          {
                            discardIfEmpty: true,
                            extract: 'SKU',
                            generate: 'item_sku',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'upccode',
                            generate: 'UPC',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'salesdescription',
                            generate: 'product_description',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'displayname',
                            generate: 'item_name',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'manufacturer',
                            generate: 'brand_name',
                          },
                        ],
                        id: 'commonAttributes',
                        lookups: [],
                        name: 'Common',
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [],
                  },
                },
              },
              operation: 'mappingData',
            },
            response: [
              {
                data: {
                  mappingData: {
                    basicMappings: {
                      recordMappings: [
                        {
                          children: [
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Dimensions',
                              name: 'Dimensions',
                            },
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Discovery',
                              name: 'Discovery',
                            },
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Images',
                              name: 'Images',
                            },
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Fulfillment',
                              name: 'Fulfillment',
                            },
                          ],
                          fieldMappings: [
                            {
                              discardIfEmpty: true,
                              extract: 'SKU',
                              generate: 'item_sku',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'upccode',
                              generate: 'UPC',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'salesdescription',
                              generate: 'product_description',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'displayname',
                              generate: 'item_name',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'manufacturer',
                              generate: 'brand_name',
                            },
                          ],
                          id: 'commonAttributes',
                          lookups: [],
                          name: 'Common',
                        },
                        {
                          children: [],
                          fieldMappings: [],
                          id: 'baby',
                          name: 'Baby',
                        },
                      ],
                    },
                    variationMappings: {
                      recordMappings: [],
                    },
                  },
                },
                operation: 'mappingData',
              },
              {
                data: [
                  {
                    id: 'hits',
                    name: '# Times Viewed',
                    type: 'integer',
                  },
                  {
                    id: 'atpleadtime',
                    name: 'ATP Lead Time',
                    type: 'float',
                  },
                  {
                    id: 'accountingbook',
                    name: 'Accounting Book',
                    type: 'select',
                  },
                  {
                    id: 'accountingbookamortization',
                    name: 'Accounting Book Amortization Schedule',
                    type: 'select',
                  },
                  {
                    id: 'accountingbookrevrecschedule',
                    name: 'Accounting Book Rev. Rec. Schedule',
                    type: 'select',
                  },
                  {
                    id: 'custitem_celigo_ebay_list_add_fee',
                    name: 'Add Listing Fee',
                    type: 'text',
                  },
                  {
                    id: 'custitem_celigo_etail_channel',
                    name: 'eTail Channel (2)',
                    type: 'multiselect',
                  },
                ],
                operation: 'extractsMetaData',
              },
              {
                data: {
                  categoryRelationshipData: [
                    {
                      children: [
                        {
                          id: 'autoaccessorymisc',
                          isLeafNode: true,
                          name: 'autoaccessorymisc',
                        },
                        {
                          id: 'autobattery',
                          isLeafNode: true,
                          name: 'autobattery',
                        },
                        {
                          id: 'autooil',
                          isLeafNode: true,
                          name: 'autooil',
                        },
                        {
                          id: 'Underwear',
                          isLeafNode: true,
                          name: 'Underwear [Moved to Clothing]',
                        },
                      ],
                      id: 'autoaccessory',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Auto Accessory',
                    },
                    {
                      children: [
                        {
                          id: 'babyproducts',
                          isLeafNode: true,
                          name: 'babyproducts',
                        },
                        {
                          id: 'infanttoddlercarseat',
                          isLeafNode: true,
                          name: 'infanttoddlercarseat',
                        },
                        {
                          id: 'stroller',
                          isLeafNode: true,
                          name: 'stroller',
                        },
                      ],
                      id: 'baby',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Baby',
                    },
                    {
                      children: [
                        {
                          id: 'beautymisc',
                          isLeafNode: true,
                          name: 'beautymisc',
                        },
                        {
                          id: 'bodycareproduct',
                          isLeafNode: true,
                          name: 'bodycareproduct',
                        },
                        {
                          id: 'conditioner',
                          isLeafNode: true,
                          name: 'conditioner',
                        },
                      ],
                      id: 'beauty',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Beauty',
                    },
                    {
                      children: [],
                      id: 'BookLoader',
                      isLeafNode: true,
                      marketplace_domain: 'US',
                      name: 'Book Loader',
                    },
                    {
                      children: [
                        {
                          id: 'binocular',
                          isLeafNode: true,
                          name: 'binocular',
                        },
                        {
                          id: 'blankmediaforcameras',
                          isLeafNode: true,
                          name: 'blankmediaforcameras',
                        },
                        {
                          id: 'camcorder',
                          isLeafNode: true,
                          name: 'camcorder',
                        },
                        {
                          id: 'Tripod',
                          isLeafNode: true,
                          name: 'Tripod [Deprecated]',
                        },
                      ],
                      id: 'cameraandphoto',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Camera and Photo',
                    },
                    {
                      children: [
                        {
                          id: 'PROTECTIVE_GLOVE',
                          isLeafNode: true,
                          name: 'PROTECTIVE_GLOVE',
                        },
                        {
                          id: 'accessory',
                          isLeafNode: true,
                          name: 'accessory',
                        },
                        {
                          id: 'childrenscostume',
                          isLeafNode: true,
                          name: 'childrenscostume',
                        },
                        {
                          id: 'vest',
                          isLeafNode: true,
                          name: 'vest',
                        },
                      ],
                      id: 'clothing',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Clothing',
                    },
                    {
                      children: [
                        {
                          id: 'Bullion',
                          isLeafNode: true,
                          name: 'Bullion',
                        },
                        {
                          id: 'Coins',
                          isLeafNode: true,
                          name: 'Coins',
                        },
                        {
                          id: 'CollectibleCoins',
                          isLeafNode: true,
                          name: 'CollectibleCoins',
                        },
                      ],
                      id: 'coins',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Coins',
                    },
                    {
                      children: [
                        {
                          id: 'FoodServiceSupply',
                          isLeafNode: true,
                          name: 'FoodServiceSupply',
                        },
                        {
                          id: 'JanitorialSupply',
                          isLeafNode: true,
                          name: 'JanitorialSupply',
                        },
                      ],
                      id: 'FoodServiceAndJanSan',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Food Service and Jan San',
                    },
                  ],
                  generatesMetaData: {
                    children: [],
                    fields: [
                      {
                        description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                        filterType: 'required',
                        id: 'item_sku',
                        name: 'Seller SKU',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
                        filterType: 'required',
                        id: 'item_name',
                        name: 'Product Name',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'A standard, alphanumeric string that uniquely identifies the product.',
                        filterType: 'preferred',
                        id: 'ASIN',
                        name: 'ASIN',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'A standard, alphanumeric string that uniquely identifies the product.',
                        filterType: 'preferred',
                        id: 'UPC',
                        name: 'UPC',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
                        filterType: 'optional',
                        id: 'item_length_unit_of_measure',
                        name: 'Item Length Unit Of Measure',
                        options: [
                          {
                            id: 'CM',
                            text: 'CM',
                          },
                          {
                            id: 'FT',
                            text: 'FT',
                          },
                          {
                            id: 'IN',
                            text: 'IN',
                          },
                          {
                            id: 'M',
                            text: 'M',
                          },
                          {
                            id: 'MM',
                            text: 'MM',
                          },
                        ],
                        type: 'select',
                      },
                    ],
                    id: 'commonAttributes',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    name: 'Common',
                    variation_attributes: [],
                    variation_themes: [],
                  },
                },
                operation: 'generatesMetaData',
              },
            ],
            uiAssistant: 'amazon',
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings deleteCategory action', () => {
      test('should set delete property correctly on mapping for parent category', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
        };

        state = reducer(state, actions.integrationApp.settings.receivedCategoryMappingMetadata('integrationId', 'flowId', amazonCategoryMappings));
        state = reducer(state, actions.integrationApp.settings.categoryMappings.addCategory('integrationId', 'flowId', {
          category: 'baby',
          childCategory: 'babyproducts',
          grandChildCategory: undefined,
        }));
        state = reducer(state, actions.integrationApp.settings.categoryMappings.deleteCategory('integrationId', 'flowId', 'babyproducts', 0));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            deleted: [
              [
                'babyproducts',
              ],
            ],
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: false,
                required: true,
              },
              mappingFilter: 'all',
            },
            generatesMetadata: [
              {
                children: [],
                fields: [
                  {
                    description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                    filterType: 'required',
                    id: 'item_sku',
                    name: 'Seller SKU',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
                    filterType: 'required',
                    id: 'item_name',
                    name: 'Product Name',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'A standard, alphanumeric string that uniquely identifies the product.',
                    filterType: 'preferred',
                    id: 'ASIN',
                    name: 'ASIN',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'A standard, alphanumeric string that uniquely identifies the product.',
                    filterType: 'preferred',
                    id: 'UPC',
                    name: 'UPC',
                    options: [],
                    type: 'input',
                  },
                  {
                    description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
                    filterType: 'optional',
                    id: 'item_length_unit_of_measure',
                    name: 'Item Length Unit Of Measure',
                    options: [
                      {
                        id: 'CM',
                        text: 'CM',
                      },
                      {
                        id: 'FT',
                        text: 'FT',
                      },
                      {
                        id: 'IN',
                        text: 'IN',
                      },
                      {
                        id: 'M',
                        text: 'M',
                      },
                      {
                        id: 'MM',
                        text: 'MM',
                      },
                    ],
                    type: 'select',
                  },
                ],
                id: 'commonAttributes',
                isLeafNode: false,
                marketplace_domain: 'US',
                name: 'Common',
                variation_attributes: [],
                variation_themes: [],
              },
            ],
            initMappingData: {
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        children: [
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Dimensions',
                            name: 'Dimensions',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Discovery',
                            name: 'Discovery',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Images',
                            name: 'Images',
                          },
                          {
                            children: [],
                            fieldMappings: [],
                            id: 'Fulfillment',
                            name: 'Fulfillment',
                          },
                        ],
                        fieldMappings: [
                          {
                            discardIfEmpty: true,
                            extract: 'SKU',
                            generate: 'item_sku',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'upccode',
                            generate: 'UPC',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'salesdescription',
                            generate: 'product_description',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'displayname',
                            generate: 'item_name',
                          },
                          {
                            discardIfEmpty: true,
                            extract: 'manufacturer',
                            generate: 'brand_name',
                          },
                        ],
                        id: 'commonAttributes',
                        lookups: [],
                        name: 'Common',
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [],
                  },
                },
              },
              operation: 'mappingData',
            },
            response: [
              {
                data: {
                  mappingData: {
                    basicMappings: {
                      recordMappings: [
                        {
                          children: [
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Dimensions',
                              name: 'Dimensions',
                            },
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Discovery',
                              name: 'Discovery',
                            },
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Images',
                              name: 'Images',
                            },
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'Fulfillment',
                              name: 'Fulfillment',
                            },
                          ],
                          fieldMappings: [
                            {
                              discardIfEmpty: true,
                              extract: 'SKU',
                              generate: 'item_sku',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'upccode',
                              generate: 'UPC',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'salesdescription',
                              generate: 'product_description',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'displayname',
                              generate: 'item_name',
                            },
                            {
                              discardIfEmpty: true,
                              extract: 'manufacturer',
                              generate: 'brand_name',
                            },
                          ],
                          id: 'commonAttributes',
                          lookups: [],
                          name: 'Common',
                        },
                        {
                          children: [
                            {
                              children: [],
                              fieldMappings: [],
                              id: 'babyproducts',
                              name: 'babyproducts',
                            },
                          ],
                          fieldMappings: [],
                          id: 'baby',
                          name: 'Baby',
                        },
                      ],
                    },
                    variationMappings: {
                      recordMappings: [],
                    },
                  },
                },
                operation: 'mappingData',
              },
              {
                data: [
                  {
                    id: 'hits',
                    name: '# Times Viewed',
                    type: 'integer',
                  },
                  {
                    id: 'atpleadtime',
                    name: 'ATP Lead Time',
                    type: 'float',
                  },
                  {
                    id: 'accountingbook',
                    name: 'Accounting Book',
                    type: 'select',
                  },
                  {
                    id: 'accountingbookamortization',
                    name: 'Accounting Book Amortization Schedule',
                    type: 'select',
                  },
                  {
                    id: 'accountingbookrevrecschedule',
                    name: 'Accounting Book Rev. Rec. Schedule',
                    type: 'select',
                  },
                  {
                    id: 'custitem_celigo_ebay_list_add_fee',
                    name: 'Add Listing Fee',
                    type: 'text',
                  },
                  {
                    id: 'custitem_celigo_etail_channel',
                    name: 'eTail Channel (2)',
                    type: 'multiselect',
                  },
                ],
                operation: 'extractsMetaData',
              },
              {
                data: {
                  categoryRelationshipData: [
                    {
                      children: [
                        {
                          id: 'autoaccessorymisc',
                          isLeafNode: true,
                          name: 'autoaccessorymisc',
                        },
                        {
                          id: 'autobattery',
                          isLeafNode: true,
                          name: 'autobattery',
                        },
                        {
                          id: 'autooil',
                          isLeafNode: true,
                          name: 'autooil',
                        },
                        {
                          id: 'Underwear',
                          isLeafNode: true,
                          name: 'Underwear [Moved to Clothing]',
                        },
                      ],
                      id: 'autoaccessory',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Auto Accessory',
                    },
                    {
                      children: [
                        {
                          id: 'babyproducts',
                          isLeafNode: true,
                          name: 'babyproducts',
                        },
                        {
                          id: 'infanttoddlercarseat',
                          isLeafNode: true,
                          name: 'infanttoddlercarseat',
                        },
                        {
                          id: 'stroller',
                          isLeafNode: true,
                          name: 'stroller',
                        },
                      ],
                      id: 'baby',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Baby',
                    },
                    {
                      children: [
                        {
                          id: 'beautymisc',
                          isLeafNode: true,
                          name: 'beautymisc',
                        },
                        {
                          id: 'bodycareproduct',
                          isLeafNode: true,
                          name: 'bodycareproduct',
                        },
                        {
                          id: 'conditioner',
                          isLeafNode: true,
                          name: 'conditioner',
                        },
                      ],
                      id: 'beauty',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Beauty',
                    },
                    {
                      children: [],
                      id: 'BookLoader',
                      isLeafNode: true,
                      marketplace_domain: 'US',
                      name: 'Book Loader',
                    },
                    {
                      children: [
                        {
                          id: 'binocular',
                          isLeafNode: true,
                          name: 'binocular',
                        },
                        {
                          id: 'blankmediaforcameras',
                          isLeafNode: true,
                          name: 'blankmediaforcameras',
                        },
                        {
                          id: 'camcorder',
                          isLeafNode: true,
                          name: 'camcorder',
                        },
                        {
                          id: 'Tripod',
                          isLeafNode: true,
                          name: 'Tripod [Deprecated]',
                        },
                      ],
                      id: 'cameraandphoto',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Camera and Photo',
                    },
                    {
                      children: [
                        {
                          id: 'PROTECTIVE_GLOVE',
                          isLeafNode: true,
                          name: 'PROTECTIVE_GLOVE',
                        },
                        {
                          id: 'accessory',
                          isLeafNode: true,
                          name: 'accessory',
                        },
                        {
                          id: 'childrenscostume',
                          isLeafNode: true,
                          name: 'childrenscostume',
                        },
                        {
                          id: 'vest',
                          isLeafNode: true,
                          name: 'vest',
                        },
                      ],
                      id: 'clothing',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Clothing',
                    },
                    {
                      children: [
                        {
                          id: 'Bullion',
                          isLeafNode: true,
                          name: 'Bullion',
                        },
                        {
                          id: 'Coins',
                          isLeafNode: true,
                          name: 'Coins',
                        },
                        {
                          id: 'CollectibleCoins',
                          isLeafNode: true,
                          name: 'CollectibleCoins',
                        },
                      ],
                      id: 'coins',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Coins',
                    },
                    {
                      children: [
                        {
                          id: 'FoodServiceSupply',
                          isLeafNode: true,
                          name: 'FoodServiceSupply',
                        },
                        {
                          id: 'JanitorialSupply',
                          isLeafNode: true,
                          name: 'JanitorialSupply',
                        },
                      ],
                      id: 'FoodServiceAndJanSan',
                      isLeafNode: false,
                      marketplace_domain: 'US',
                      name: 'Food Service and Jan San',
                    },
                  ],
                  generatesMetaData: {
                    children: [],
                    fields: [
                      {
                        description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                        filterType: 'required',
                        id: 'item_sku',
                        name: 'Seller SKU',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
                        filterType: 'required',
                        id: 'item_name',
                        name: 'Product Name',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'A standard, alphanumeric string that uniquely identifies the product.',
                        filterType: 'preferred',
                        id: 'ASIN',
                        name: 'ASIN',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'A standard, alphanumeric string that uniquely identifies the product.',
                        filterType: 'preferred',
                        id: 'UPC',
                        name: 'UPC',
                        options: [],
                        type: 'input',
                      },
                      {
                        description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
                        filterType: 'optional',
                        id: 'item_length_unit_of_measure',
                        name: 'Item Length Unit Of Measure',
                        options: [
                          {
                            id: 'CM',
                            text: 'CM',
                          },
                          {
                            id: 'FT',
                            text: 'FT',
                          },
                          {
                            id: 'IN',
                            text: 'IN',
                          },
                          {
                            id: 'M',
                            text: 'M',
                          },
                          {
                            id: 'MM',
                            text: 'MM',
                          },
                        ],
                        type: 'select',
                      },
                    ],
                    id: 'commonAttributes',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    name: 'Common',
                    variation_attributes: [],
                    variation_themes: [],
                  },
                },
                operation: 'generatesMetaData',
              },
            ],
            uiAssistant: 'amazon',
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings restoreCategory action', () => {
      test('should set correctly the deleted sections array on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            deleted: [['coins', 'batteries', 'clothing']],
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.restoreCategory('integrationId', 'flowId', 'coins', 0));

        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            deleted: [['batteries', 'clothing']],
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings receivedUpdatedData action', () => {
      test('should set correctly update the mappings data', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            deleted: ['coins', 'batteries', 'clothing'],
            response: [{
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [{a: 'b'}],
                  },
                  variationMappings: {
                    recordMappings: [{c: 'd'}],
                  },
                },
              },
            }],
            initMappingData: {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [{a: 'b'}],
                  },
                  variationMappings: {
                    recordMappings: [{c: 'd'}],
                  },
                },
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.receivedUpdatedMappingData('integrationId', 'flowId', {
          operation: 'mappingData',
          data: {
            mappingData: {
              basicMappings: {
                recordMappings: [{updated: 'mappings'}],
              },
              variationMappings: {
                recordMappings: [{new: 'data'}],
              },
            },
          },
        }));

        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            saveStatus: 'saved',
            deleted: ['coins', 'batteries', 'clothing'],
            response: [{
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [{updated: 'mappings'}],
                  },
                  variationMappings: {
                    recordMappings: [{new: 'data'}],
                  },
                },
              },
            }],
            initMappingData: {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [{updated: 'mappings'}],
                  },
                  variationMappings: {
                    recordMappings: [{new: 'data'}],
                  },
                },
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });

      test('should set correctly update the mappings data with appropriate save status', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            closeOnSave: true,
            deleted: ['coins', 'batteries', 'clothing'],
            response: [{
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [{a: 'b'}],
                  },
                  variationMappings: {
                    recordMappings: [{c: 'd'}],
                  },
                },
              },
            }],
            initMappingData: {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [{a: 'b'}],
                  },
                  variationMappings: {
                    recordMappings: [{c: 'd'}],
                  },
                },
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.receivedUpdatedMappingData('integrationId', 'flowId', {
          operation: 'mappingData',
          data: {
            mappingData: {
              basicMappings: {
                recordMappings: [{updated: 'mappings'}],
              },
              variationMappings: {
                recordMappings: [{new: 'data'}],
              },
            },
          },
        }));

        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            saveStatus: 'close',
            closeOnSave: true,
            deleted: ['coins', 'batteries', 'clothing'],
            response: [{
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [{updated: 'mappings'}],
                  },
                  variationMappings: {
                    recordMappings: [{new: 'data'}],
                  },
                },
              },
            }],
            initMappingData: {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [{updated: 'mappings'}],
                  },
                  variationMappings: {
                    recordMappings: [{new: 'data'}],
                  },
                },
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings expandAll action', () => {
      test('should set correctly the expandAll property on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.expandAll('integrationId', 'flowId'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            collapseStatus: {
              collapseAction: 'expand',
              collapseStatus: 'expanded',
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });

      test('should not change state if invalid integration or flowId is sent', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.expandAll('integrationIdInvalid', 'flowIdInvalid'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings collapseAll action', () => {
      test('should set correctly the colapseAll property on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.collapseAll('integrationId', 'flowId'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            collapseStatus: {
              collapseAction: 'collapse',
              collapseStatus: 'collapsed',
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });

      test('should not change state if invalid integration or flowId is sent', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.expandAll('integrationIdInvalid', 'flowIdInvalid'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings collapseAll action', () => {
      test('should set correctly the colapseAll property on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.collapseAll('integrationId', 'flowId'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            collapseStatus: {
              collapseAction: 'collapse',
              collapseStatus: 'collapsed',
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });

      test('should not change state if invalid integration or flowId is sent', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.expandAll('integrationIdInvalid', 'flowIdInvalid'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });

    describe('integrationApps settings categoryMappings clearCollapseStatus action', () => {
      test('should clear correctly the colapseAll property on mapping', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            collapseStatus: {
              collapseAction: 'collapse',
              collapseStatus: 'collapsed',
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.clearCollapseStatus('integrationId', 'flowId'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            collapseStatus: {
              collapseStatus: 'collapsed',
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });

      test('should not change state if invalid integration or flowId is sent', () => {
        let state = {
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            collapseStatus: {
              collapseAction: 'collapse',
              collapseStatus: 'collapsed',
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        };

        state = reducer(state, actions.integrationApp.settings.categoryMappings.clearCollapseStatus('integrationIdInvalid', 'flowIdInvalid'));
        expect(state).toEqual({
          'flow1-integration1': {
            data: 'dummy',
          },
          'flowId-integrationId': {
            filters: {
              attributes: {
                conditional: false,
                optional: false,
                preferred: true,
                required: true,
              },
            },
            collapseStatus: {
              collapseAction: 'collapse',
              collapseStatus: 'collapsed',
            },
            mappings: {
              mappingId: {
                lookups: [],
                mappings: [],
              },
            },
          },
        });
      });
    });
  });
});

describe('integrationApps selectors test cases', () => {
  describe('integrationApps settings integrationAppSettingsFormState test', () => {
    test('should not throw exception for bad params', () => {
      expect(selectors.integrationAppSettingsFormState()).toEqual({});
      expect(selectors.integrationAppSettingsFormState({})).toEqual({});
      expect(selectors.integrationAppSettingsFormState(null)).toEqual({});
      expect(selectors.integrationAppSettingsFormState(null, null, null, null)).toEqual({});
    });

    test('should return correct form state for params passed', () => {
      const state = {
        'flow1-integration1': {
          response: [{}],
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
      };

      expect(selectors.integrationAppSettingsFormState(state, 'integrationId', 'flowId', 'sectionId')).toEqual({
        dummy: 'data',
      });
      expect(selectors.integrationAppSettingsFormState(state, 'integrationId', 'flowId')).toEqual({});
    });
  });

  describe('integrationApps settings mkCategoryMappingsCollapsedStatus test', () => {
    const categoryMappingsCollapsedStatusSelector = selectors.mkCategoryMappingsCollapsedStatus();

    test('should not throw exception for bad params', () => {
      expect(categoryMappingsCollapsedStatusSelector()).toEqual({});
      expect(categoryMappingsCollapsedStatusSelector({})).toEqual({});
      expect(categoryMappingsCollapsedStatusSelector(null)).toEqual({});
      expect(categoryMappingsCollapsedStatusSelector(null, null, null, null)).toEqual({});
    });

    test('should return correct form state for params passed', () => {
      const state = {
        'flow1-integration1': {
          response: [{}],
          collapseStatus: {
            collapsed: true,
            collapseAction: 'collapse',
          },
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
        'flow2-integration2': {},
      };

      expect(categoryMappingsCollapsedStatusSelector(state, 'integration1', 'flow1')).toEqual({
        collapsed: true,
        collapseAction: 'collapse',
      });
      expect(categoryMappingsCollapsedStatusSelector(state, 'integration2', 'flow2')).toEqual({
      });
    });
  });

  describe('integrationApps settings mkCategoryMappingFilters test', () => {
    const cmFiltersSelector = selectors.mkCategoryMappingFilters();

    test('should not throw exception for bad params', () => {
      expect(cmFiltersSelector()).toEqual(null);
      expect(cmFiltersSelector({})).toEqual(null);
      expect(cmFiltersSelector(null)).toEqual(null);
      expect(cmFiltersSelector(null, null, null, null)).toEqual(null);
    });

    test('should return correct form state for params passed', () => {
      const state = {
        'flow1-integration1': {
          response: [{}],
          collapseStatus: {
            collapsed: true,
            collapseAction: 'collapse',
          },
          filters: {
            attributes: {
              preferred: true,
              optional: true,
            },
            mappingFilter: 'all',
          },
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
        'flow2-integration2': {},
      };

      expect(cmFiltersSelector(state, 'integration1', 'flow1')).toEqual({
        attributes: {
          preferred: true,
          optional: true,
        },
        mappingFilter: 'all',
      });
      expect(cmFiltersSelector(state, 'integration2', 'flow2')).toEqual();
    });
  });

  describe('integrationApps settings mkCategoryMappingFilters test', () => {
    const cmFiltersSelector = selectors.mkCategoryMappingFilters();

    test('should not throw exception for bad params', () => {
      expect(cmFiltersSelector()).toEqual(null);
      expect(cmFiltersSelector({})).toEqual(null);
      expect(cmFiltersSelector(null)).toEqual(null);
      expect(cmFiltersSelector(null, null, null, null)).toEqual(null);
    });

    test('should return correct form state for params passed', () => {
      const state = {
        'flow1-integration1': {
          response: [{}],
          collapseStatus: {
            collapsed: true,
            collapseAction: 'collapse',
          },
          filters: {
            attributes: {
              preferred: true,
              optional: true,
            },
            mappingFilter: 'all',
          },
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
        'flow2-integration2': {},
      };

      expect(cmFiltersSelector(state, 'integration1', 'flow1')).toEqual({
        attributes: {
          preferred: true,
          optional: true,
        },
        mappingFilter: 'all',
      });
      expect(cmFiltersSelector(state, 'integration2', 'flow2')).toEqual();
    });
  });

  describe('integrationApps settings categoryMapping test', () => {
    test('should not throw exception for bad params', () => {
      expect(selectors.categoryMapping()).toEqual(null);
      expect(selectors.categoryMapping({})).toEqual();
      expect(selectors.categoryMapping(null)).toEqual(null);
      expect(selectors.categoryMapping(null, null, null)).toEqual(null);
    });

    test('should return correct form state for params passed', () => {
      const state = {
        'flow1-integration1': {
          response: [{}],
          collapseStatus: {
            collapsed: true,
            collapseAction: 'collapse',
          },
          filters: {
            attributes: {
              preferred: true,
              optional: true,
            },
            mappingFilter: 'all',
          },
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
        'flow2-integration2': {},
      };

      expect(selectors.categoryMapping(state, 'integration1', 'flow1')).toEqual({
        response: [{}],
        collapseStatus: {
          collapsed: true,
          collapseAction: 'collapse',
        },
        filters: {
          attributes: {
            preferred: true,
            optional: true,
          },
          mappingFilter: 'all',
        },
        uiAssistant: 'amazon',
      });
      expect(selectors.categoryMapping(state, 'integration2', 'flow2')).toEqual({});
    });
  });

  describe('integrationApps settings mkMappedcategories test', () => {
    const mappedCategoriesSelector = selectors.mkMappedCategories();

    test('should not throw exception for bad params', () => {
      expect(mappedCategoriesSelector()).toEqual([]);
      expect(mappedCategoriesSelector({})).toEqual([]);
      expect(mappedCategoriesSelector(null)).toEqual([]);
      expect(mappedCategoriesSelector(null, null, null, null)).toEqual([]);
    });

    test('should return correct form state for params passed', () => {
      let state = {
        'flow1-integration1': {
          response: [{}],
          collapseStatus: {
            collapsed: true,
            collapseAction: 'collapse',
          },
          filters: {
            attributes: {
              preferred: true,
              optional: true,
            },
            mappingFilter: 'all',
          },
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
        'flow2-integration2': {},
      };

      state = reducer(state, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration1', 'flow1', amazonCategoryMappings));
      expect(mappedCategoriesSelector(state, 'integration1', 'flow1')).toEqual([
        {
          children: [
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Dimensions',
              name: 'Dimensions',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Discovery',
              name: 'Discovery',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Images',
              name: 'Images',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Fulfillment',
              name: 'Fulfillment',
            },
          ],
          id: 'commonAttributes',
          name: 'Common',
        },
      ]);
      expect(mappedCategoriesSelector(state, 'integration2', 'flow2')).toEqual([]);
    });
  });

  describe('integrationApps settings mkVariationMappingData test', () => {
    const mappedVariationsSelector = selectors.mkVariationMappingData();

    test('should not throw exception for bad params', () => {
      expect(mappedVariationsSelector()).toEqual([]);
      expect(mappedVariationsSelector({})).toEqual([]);
      expect(mappedVariationsSelector(null)).toEqual([]);
      expect(mappedVariationsSelector(null, null, null, null)).toEqual([]);
    });

    test('should return correct form state for params passed', () => {
      const state = {
        'flow1-integration1': {
          response: [{
            operation: 'mappingData',
            data: {
              mappingData: {
                basicMappings: {
                  recordMappings: [
                    {
                      id: 'commonAttributes',
                      name: 'commonAttributes',
                      children: [
                        {
                          id: 'Dimensions',
                          name: 'Dimensions',
                          children: [

                          ],
                          fieldMappings: [

                          ],
                        },
                        {
                          id: 'Discovery',
                          name: 'Discovery',
                          children: [

                          ],
                          fieldMappings: [

                          ],
                        },
                        {
                          id: 'Images',
                          name: 'Images',
                          children: [

                          ],
                          fieldMappings: [

                          ],
                        },
                        {
                          id: 'Fulfillment',
                          name: 'Fulfillment',
                          children: [

                          ],
                          fieldMappings: [

                          ],
                        },
                      ],
                      fieldMappings: [
                        {
                          extract: 'upccode',
                          generate: 'UPC',
                          discardIfEmpty: true,
                        },
                        {
                          extract: 'salesdescription',
                          generate: 'product_description',
                          discardIfEmpty: true,
                        },
                        {
                          extract: 'displayname',
                          generate: 'item_name',
                          discardIfEmpty: true,
                        },
                        {
                          extract: 'manufacturer',
                          generate: 'brand_name',
                          discardIfEmpty: true,
                        },
                        {
                          extract: 'manufacturer',
                          generate: 'manufacturer',
                          discardIfEmpty: true,
                        },
                        {
                          extract: 'mpn',
                          generate: 'part_number',
                          discardIfEmpty: true,
                        },
                        {
                          generate: 'update_delete',
                          hardCodedValue: 'Update',
                          dataType: 'string',
                        },
                      ],
                      lookups: [

                      ],
                    },
                    {
                      id: 'BookLoader',
                      name: 'BookLoader',
                      children: [

                      ],
                      fieldMappings: [

                      ],
                    },
                    {
                      id: 'autoaccessory',
                      name: 'autoaccessory',
                      children: [
                        {
                          id: 'autoaccessorymisc',
                          name: 'autoaccessorymisc',
                          children: [

                          ],
                          fieldMappings: [

                          ],
                        },
                      ],
                      fieldMappings: [

                      ],
                      lookups: [

                      ],
                    },
                    {
                      id: 'cameraandphoto',
                      name: 'cameraandphoto',
                      children: [
                        {
                          id: 'binocular',
                          name: 'binocular',
                          children: [

                          ],
                          fieldMappings: [

                          ],
                        },
                      ],
                      fieldMappings: [

                      ],
                      lookups: [

                      ],
                    },
                  ],
                },
                variationMappings: {
                  recordMappings: [
                    {
                      id: 'autoaccessory',
                      children: [
                        {
                          id: 'autoaccessorymisc',
                          children: [

                          ],
                          variation_themes: [
                            {
                              id: 'variation_theme',
                              variation_theme: 'itempackagequantity',
                              fieldMappings: [
                                {
                                  extract: 'hits',
                                  generate: 'exterior_finish',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      variation_themes: [

                      ],
                    },
                    {
                      id: 'cameraandphoto',
                      children: [
                        {
                          id: 'binocular',
                          children: [

                          ],
                          variation_themes: [
                            {
                              id: 'variation_theme',
                              variation_theme: 'SizeName',
                              fieldMappings: [
                                {
                                  extract: 'hits',
                                  generate: 'department_name1',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      variation_themes: [

                      ],
                    },
                  ],
                },
              },
            },
          }],
          collapseStatus: {
            collapsed: true,
            collapseAction: 'collapse',
          },
          filters: {
            attributes: {
              preferred: true,
              optional: true,
            },
            mappingFilter: 'all',
          },
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
        'flow2-integration2': {},
      };

      expect(mappedVariationsSelector(state, 'integration1', 'flow1')).toEqual([
        {
          children: [
            {
              children: [],
              id: 'autoaccessorymisc',
              variation_themes: [
                {
                  fieldMappings: [
                    {
                      extract: 'hits',
                      generate: 'exterior_finish',
                    },
                  ],
                  id: 'variation_theme',
                  variation_theme: 'itempackagequantity',
                },
              ],
            },
          ],
          deleted: false,
          depth: 0,
          id: 'autoaccessory',
          isRoot: true,
          variation_themes: [],
        },
        {
          children: [],
          deleted: false,
          depth: 1,
          id: 'autoaccessorymisc',
          isRoot: false,
          variation_themes: [
            {
              fieldMappings: [
                {
                  extract: 'hits',
                  generate: 'exterior_finish',
                },
              ],
              id: 'variation_theme',
              variation_theme: 'itempackagequantity',
            },
          ],
        },
        {
          children: [
            {
              children: [],
              id: 'binocular',
              variation_themes: [
                {
                  fieldMappings: [
                    {
                      extract: 'hits',
                      generate: 'department_name1',
                    },
                  ],
                  id: 'variation_theme',
                  variation_theme: 'SizeName',
                },
              ],
            },
          ],
          deleted: false,
          depth: 0,
          id: 'cameraandphoto',
          isRoot: true,
          variation_themes: [],
        },
        {
          children: [],
          deleted: false,
          depth: 1,
          id: 'binocular',
          isRoot: false,
          variation_themes: [
            {
              fieldMappings: [
                {
                  extract: 'hits',
                  generate: 'department_name1',
                },
              ],
              id: 'variation_theme',
              variation_theme: 'SizeName',
            },
          ],
        },
      ]);
      expect(mappedVariationsSelector(state, 'integration2', 'flow2')).toEqual([]);
    });
  });

  describe('integrationApps settings mkMappingsForVariation test', () => {
    const selector = selectors.mkMappingsForVariation();

    test('should not throw exception for bad params', () => {
      expect(selector()).toEqual({});
      expect(selector({})).toEqual({});
      expect(selector(null)).toEqual({});
    });

    test('should return correct form state for params passed for variationAttributes set as false', () => {
      const state = {
        'flow1-integration1': {
          response: [
            {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        id: 'commonAttributes',
                        name: 'commonAttributes',
                        children: [
                          {
                            id: 'Dimensions',
                            name: 'Dimensions',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Discovery',
                            name: 'Discovery',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Images',
                            name: 'Images',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Fulfillment',
                            name: 'Fulfillment',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [
                          {
                            extract: 'upccode',
                            generate: 'UPC',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'salesdescription',
                            generate: 'product_description',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'displayname',
                            generate: 'item_name',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'manufacturer',
                            generate: 'brand_name',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'manufacturer',
                            generate: 'manufacturer',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'mpn',
                            generate: 'part_number',
                            discardIfEmpty: true,
                          },
                          {
                            generate: 'update_delete',
                            hardCodedValue: 'Update',
                            dataType: 'string',
                          },
                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'BookLoader',
                        name: 'BookLoader',
                        children: [

                        ],
                        fieldMappings: [

                        ],
                      },
                      {
                        id: 'autoaccessory',
                        name: 'autoaccessory',
                        children: [
                          {
                            id: 'autoaccessorymisc',
                            name: 'autoaccessorymisc',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'cameraandphoto',
                        name: 'cameraandphoto',
                        children: [
                          {
                            id: 'binocular',
                            name: 'binocular',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                        lookups: [

                        ],
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [
                      {
                        id: 'autoaccessory',
                        children: [
                          {
                            id: 'autoaccessorymisc',
                            children: [

                            ],
                            variation_themes: [
                              {
                                id: 'variation_theme',
                                variation_theme: 'itempackagequantity',
                                fieldMappings: [
                                  {
                                    extract: 'hits',
                                    generate: 'exterior_finish',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                        variation_themes: [

                        ],
                      },
                      {
                        id: 'cameraandphoto',
                        children: [
                          {
                            id: 'binocular',
                            children: [

                            ],
                            variation_themes: [
                              {
                                id: 'variation_theme',
                                variation_theme: 'SizeName',
                                fieldMappings: [
                                  {
                                    extract: 'hits',
                                    generate: 'department_name1',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                        variation_themes: [

                        ],
                      },
                    ],
                  },
                },
              },
            },
            {
              operation: 'generatesMetaData',
              data: {
                categoryRelationshipData: [
                  {
                    id: 'autoaccessory',
                    name: 'Auto Accessory',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'autoaccessorymisc',
                        name: 'autoaccessorymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'autobattery',
                        name: 'autobattery',
                        isLeafNode: true,
                      },
                      {
                        id: 'autooil',
                        name: 'autooil',
                        isLeafNode: true,
                      },
                      {
                        id: 'Underwear',
                        name: 'Underwear [Moved to Clothing]',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'baby',
                    name: 'Baby',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'babyproducts',
                        name: 'babyproducts',
                        isLeafNode: true,
                      },
                      {
                        id: 'infanttoddlercarseat',
                        name: 'infanttoddlercarseat',
                        isLeafNode: true,
                      },
                      {
                        id: 'stroller',
                        name: 'stroller',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'beauty',
                    name: 'Beauty',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'beautymisc',
                        name: 'beautymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'bodycareproduct',
                        name: 'bodycareproduct',
                        isLeafNode: true,
                      },
                      {
                        id: 'conditioner',
                        name: 'conditioner',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'BookLoader',
                    name: 'Book Loader',
                    isLeafNode: true,
                    marketplace_domain: 'US',
                    children: [

                    ],
                  },
                  {
                    id: 'cameraandphoto',
                    name: 'Camera and Photo',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'binocular',
                        name: 'binocular',
                        isLeafNode: true,
                      },
                      {
                        id: 'blankmediaforcameras',
                        name: 'blankmediaforcameras',
                        isLeafNode: true,
                      },
                      {
                        id: 'camcorder',
                        name: 'camcorder',
                        isLeafNode: true,
                      },
                      {
                        id: 'Tripod',
                        name: 'Tripod [Deprecated]',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'clothing',
                    name: 'Clothing',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'PROTECTIVE_GLOVE',
                        name: 'PROTECTIVE_GLOVE',
                        isLeafNode: true,
                      },
                      {
                        id: 'accessory',
                        name: 'accessory',
                        isLeafNode: true,
                      },
                      {
                        id: 'childrenscostume',
                        name: 'childrenscostume',
                        isLeafNode: true,
                      },
                      {
                        id: 'vest',
                        name: 'vest',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'coins',
                    name: 'Coins',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'Bullion',
                        name: 'Bullion',
                        isLeafNode: true,
                      },
                      {
                        id: 'Coins',
                        name: 'Coins',
                        isLeafNode: true,
                      },
                      {
                        id: 'CollectibleCoins',
                        name: 'CollectibleCoins',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'FoodServiceAndJanSan',
                    name: 'Food Service and Jan San',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'FoodServiceSupply',
                        name: 'FoodServiceSupply',
                        isLeafNode: true,
                      },
                      {
                        id: 'JanitorialSupply',
                        name: 'JanitorialSupply',
                        isLeafNode: true,
                      },
                    ],
                  },
                ],

              },
            },
          ],
          collapseStatus: {
            collapsed: true,
            collapseAction: 'collapse',
          },
          filters: {
            attributes: {
              preferred: true,
              optional: true,
            },
            mappingFilter: 'all',
          },
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
        'flow2-integration2': {},
      };

      expect(selector(state, 'integration1', 'flow1', {
        isVariationAttributes: false,
        sectionId: 'autoaccessorymisc',
        variation: 'itempackagequantity',
      })).toEqual({
        fieldMappings: [
          {
            extract: 'hits',
            generate: 'exterior_finish',
          },
        ],
        id: 'variation_theme',
        variation_theme: 'itempackagequantity',
      });
    });

    test('should return correct form state for params passed for variationAttributes set as true', () => {
      const state = {
        'flow1-integration1': {
          response: [
            {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        id: 'commonAttributes',
                        name: 'commonAttributes',
                        children: [
                          {
                            id: 'Dimensions',
                            name: 'Dimensions',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Discovery',
                            name: 'Discovery',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Images',
                            name: 'Images',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Fulfillment',
                            name: 'Fulfillment',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [
                          {
                            extract: 'upccode',
                            generate: 'UPC',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'salesdescription',
                            generate: 'product_description',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'displayname',
                            generate: 'item_name',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'manufacturer',
                            generate: 'brand_name',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'manufacturer',
                            generate: 'manufacturer',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'mpn',
                            generate: 'part_number',
                            discardIfEmpty: true,
                          },
                          {
                            generate: 'update_delete',
                            hardCodedValue: 'Update',
                            dataType: 'string',
                          },
                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'BookLoader',
                        name: 'BookLoader',
                        children: [

                        ],
                        fieldMappings: [

                        ],
                      },
                      {
                        id: 'autoaccessory',
                        name: 'autoaccessory',
                        children: [
                          {
                            id: 'autoaccessorymisc',
                            name: 'autoaccessorymisc',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'cameraandphoto',
                        name: 'cameraandphoto',
                        children: [
                          {
                            id: 'binocular',
                            name: 'binocular',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                        lookups: [

                        ],
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [
                      {
                        id: 'Animal',
                        children: [
                          {
                            id: 'AnimalAccessories',
                            children: [

                            ],
                            fieldMappings: [
                              {
                                extract: 'atpleadtime',
                                generate: 'size',
                                discardIfEmpty: true,
                              },
                              {
                                extract: 'accountingbook',
                                generate: 'color',
                                discardIfEmpty: true,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        id: 'ArtAndCraftCategory',
                        children: [
                          {
                            id: 'ArtAndCraft',
                            children: [

                            ],
                            fieldMappings: [
                              {
                                extract: 'yes',
                                generate: 'material',
                                discardIfEmpty: true,
                              },
                              {
                                extract: 'hits',
                                generate: 'shape',
                                discardIfEmpty: true,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
            {
              operation: 'generatesMetaData',
              data: {
                categoryRelationshipData: [
                  {
                    id: 'autoaccessory',
                    name: 'Auto Accessory',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'autoaccessorymisc',
                        name: 'autoaccessorymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'autobattery',
                        name: 'autobattery',
                        isLeafNode: true,
                      },
                      {
                        id: 'autooil',
                        name: 'autooil',
                        isLeafNode: true,
                      },
                      {
                        id: 'Underwear',
                        name: 'Underwear [Moved to Clothing]',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'baby',
                    name: 'Baby',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'babyproducts',
                        name: 'babyproducts',
                        isLeafNode: true,
                      },
                      {
                        id: 'infanttoddlercarseat',
                        name: 'infanttoddlercarseat',
                        isLeafNode: true,
                      },
                      {
                        id: 'stroller',
                        name: 'stroller',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'beauty',
                    name: 'Beauty',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'beautymisc',
                        name: 'beautymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'bodycareproduct',
                        name: 'bodycareproduct',
                        isLeafNode: true,
                      },
                      {
                        id: 'conditioner',
                        name: 'conditioner',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'BookLoader',
                    name: 'Book Loader',
                    isLeafNode: true,
                    marketplace_domain: 'US',
                    children: [

                    ],
                  },
                  {
                    id: 'cameraandphoto',
                    name: 'Camera and Photo',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'binocular',
                        name: 'binocular',
                        isLeafNode: true,
                      },
                      {
                        id: 'blankmediaforcameras',
                        name: 'blankmediaforcameras',
                        isLeafNode: true,
                      },
                      {
                        id: 'camcorder',
                        name: 'camcorder',
                        isLeafNode: true,
                      },
                      {
                        id: 'Tripod',
                        name: 'Tripod [Deprecated]',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'clothing',
                    name: 'Clothing',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'PROTECTIVE_GLOVE',
                        name: 'PROTECTIVE_GLOVE',
                        isLeafNode: true,
                      },
                      {
                        id: 'accessory',
                        name: 'accessory',
                        isLeafNode: true,
                      },
                      {
                        id: 'childrenscostume',
                        name: 'childrenscostume',
                        isLeafNode: true,
                      },
                      {
                        id: 'vest',
                        name: 'vest',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'coins',
                    name: 'Coins',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'Bullion',
                        name: 'Bullion',
                        isLeafNode: true,
                      },
                      {
                        id: 'Coins',
                        name: 'Coins',
                        isLeafNode: true,
                      },
                      {
                        id: 'CollectibleCoins',
                        name: 'CollectibleCoins',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'FoodServiceAndJanSan',
                    name: 'Food Service and Jan San',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'FoodServiceSupply',
                        name: 'FoodServiceSupply',
                        isLeafNode: true,
                      },
                      {
                        id: 'JanitorialSupply',
                        name: 'JanitorialSupply',
                        isLeafNode: true,
                      },
                    ],
                  },
                ],

              },
            },
          ],
          collapseStatus: {
            collapsed: true,
            collapseAction: 'collapse',
          },
          filters: {
            attributes: {
              preferred: true,
              optional: true,
            },
            mappingFilter: 'all',
          },
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
        'flow2-integration2': {},
      };

      expect(selector(state, 'integration1', 'flow1', {
        isVariationAttributes: true,
        sectionId: 'AnimalAccessories',
        variation: undefined,
      })).toEqual({
        children: [],
        deleted: false,
        depth: 1,
        fieldMappings: [
          {
            discardIfEmpty: true,
            extract: 'atpleadtime',
            generate: 'size',
          },
          {
            discardIfEmpty: true,
            extract: 'accountingbook',
            generate: 'color',
          },
        ],
        id: 'AnimalAccessories',
        isRoot: false,
      });
    });
  });

  describe('integrationApps settings mkCategoryMappingData test', () => {
    const selector = selectors.mkCategoryMappingData();

    test('should not throw exception for bad params', () => {
      expect(selector()).toEqual([]);
      expect(selector({})).toEqual([]);
      expect(selector(null)).toEqual([]);
    });

    test('should return correct form state for params passed for variationAttributes set as false', () => {
      const state = {
        'flow1-integration1': {
          response: [
            {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        id: 'commonAttributes',
                        name: 'commonAttributes',
                        children: [
                          {
                            id: 'Dimensions',
                            name: 'Dimensions',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Discovery',
                            name: 'Discovery',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Images',
                            name: 'Images',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Fulfillment',
                            name: 'Fulfillment',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [
                          {
                            extract: 'upccode',
                            generate: 'UPC',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'salesdescription',
                            generate: 'product_description',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'displayname',
                            generate: 'item_name',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'manufacturer',
                            generate: 'brand_name',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'manufacturer',
                            generate: 'manufacturer',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'mpn',
                            generate: 'part_number',
                            discardIfEmpty: true,
                          },
                          {
                            generate: 'update_delete',
                            hardCodedValue: 'Update',
                            dataType: 'string',
                          },
                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'BookLoader',
                        name: 'BookLoader',
                        children: [

                        ],
                        fieldMappings: [

                        ],
                      },
                      {
                        id: 'autoaccessory',
                        name: 'autoaccessory',
                        children: [
                          {
                            id: 'autoaccessorymisc',
                            name: 'autoaccessorymisc',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'cameraandphoto',
                        name: 'cameraandphoto',
                        children: [
                          {
                            id: 'binocular',
                            name: 'binocular',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                        lookups: [

                        ],
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [
                      {
                        id: 'autoaccessory',
                        children: [
                          {
                            id: 'autoaccessorymisc',
                            children: [

                            ],
                            variation_themes: [
                              {
                                id: 'variation_theme',
                                variation_theme: 'itempackagequantity',
                                fieldMappings: [
                                  {
                                    extract: 'hits',
                                    generate: 'exterior_finish',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                        variation_themes: [

                        ],
                      },
                      {
                        id: 'cameraandphoto',
                        children: [
                          {
                            id: 'binocular',
                            children: [

                            ],
                            variation_themes: [
                              {
                                id: 'variation_theme',
                                variation_theme: 'SizeName',
                                fieldMappings: [
                                  {
                                    extract: 'hits',
                                    generate: 'department_name1',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                        variation_themes: [

                        ],
                      },
                    ],
                  },
                },
              },
            },
            {
              operation: 'generatesMetaData',
              data: {
                categoryRelationshipData: [
                  {
                    id: 'autoaccessory',
                    name: 'Auto Accessory',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'autoaccessorymisc',
                        name: 'autoaccessorymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'autobattery',
                        name: 'autobattery',
                        isLeafNode: true,
                      },
                      {
                        id: 'autooil',
                        name: 'autooil',
                        isLeafNode: true,
                      },
                      {
                        id: 'Underwear',
                        name: 'Underwear [Moved to Clothing]',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'baby',
                    name: 'Baby',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'babyproducts',
                        name: 'babyproducts',
                        isLeafNode: true,
                      },
                      {
                        id: 'infanttoddlercarseat',
                        name: 'infanttoddlercarseat',
                        isLeafNode: true,
                      },
                      {
                        id: 'stroller',
                        name: 'stroller',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'beauty',
                    name: 'Beauty',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'beautymisc',
                        name: 'beautymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'bodycareproduct',
                        name: 'bodycareproduct',
                        isLeafNode: true,
                      },
                      {
                        id: 'conditioner',
                        name: 'conditioner',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'BookLoader',
                    name: 'Book Loader',
                    isLeafNode: true,
                    marketplace_domain: 'US',
                    children: [

                    ],
                  },
                  {
                    id: 'cameraandphoto',
                    name: 'Camera and Photo',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'binocular',
                        name: 'binocular',
                        isLeafNode: true,
                      },
                      {
                        id: 'blankmediaforcameras',
                        name: 'blankmediaforcameras',
                        isLeafNode: true,
                      },
                      {
                        id: 'camcorder',
                        name: 'camcorder',
                        isLeafNode: true,
                      },
                      {
                        id: 'Tripod',
                        name: 'Tripod [Deprecated]',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'clothing',
                    name: 'Clothing',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'PROTECTIVE_GLOVE',
                        name: 'PROTECTIVE_GLOVE',
                        isLeafNode: true,
                      },
                      {
                        id: 'accessory',
                        name: 'accessory',
                        isLeafNode: true,
                      },
                      {
                        id: 'childrenscostume',
                        name: 'childrenscostume',
                        isLeafNode: true,
                      },
                      {
                        id: 'vest',
                        name: 'vest',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'coins',
                    name: 'Coins',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'Bullion',
                        name: 'Bullion',
                        isLeafNode: true,
                      },
                      {
                        id: 'Coins',
                        name: 'Coins',
                        isLeafNode: true,
                      },
                      {
                        id: 'CollectibleCoins',
                        name: 'CollectibleCoins',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'FoodServiceAndJanSan',
                    name: 'Food Service and Jan San',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'FoodServiceSupply',
                        name: 'FoodServiceSupply',
                        isLeafNode: true,
                      },
                      {
                        id: 'JanitorialSupply',
                        name: 'JanitorialSupply',
                        isLeafNode: true,
                      },
                    ],
                  },
                ],

              },
            },
          ],
          collapseStatus: {
            collapsed: true,
            collapseAction: 'collapse',
          },
          filters: {
            attributes: {
              preferred: true,
              optional: true,
            },
            mappingFilter: 'all',
          },
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
        'flow2-integration2': {},
      };

      expect(selector(state, 'integration1', 'flow1')).toEqual([
        {
          children: [
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Dimensions',
              name: 'Dimensions',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Discovery',
              name: 'Discovery',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Images',
              name: 'Images',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Fulfillment',
              name: 'Fulfillment',
            },
          ],
          deleted: false,
          depth: 0,
          fieldMappings: [
            {
              discardIfEmpty: true,
              extract: 'upccode',
              generate: 'UPC',
            },
            {
              discardIfEmpty: true,
              extract: 'salesdescription',
              generate: 'product_description',
            },
            {
              discardIfEmpty: true,
              extract: 'displayname',
              generate: 'item_name',
            },
            {
              discardIfEmpty: true,
              extract: 'manufacturer',
              generate: 'brand_name',
            },
            {
              discardIfEmpty: true,
              extract: 'manufacturer',
              generate: 'manufacturer',
            },
            {
              discardIfEmpty: true,
              extract: 'mpn',
              generate: 'part_number',
            },
            {
              dataType: 'string',
              generate: 'update_delete',
              hardCodedValue: 'Update',
            },
          ],
          id: 'commonAttributes',
          isRoot: true,
          lookups: [

          ],
          name: 'commonAttributes',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'Dimensions',
          isRoot: false,
          name: 'Dimensions',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'Discovery',
          isRoot: false,
          name: 'Discovery',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'Images',
          isRoot: false,
          name: 'Images',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'Fulfillment',
          isRoot: false,
          name: 'Fulfillment',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 0,
          fieldMappings: [

          ],
          id: 'BookLoader',
          isRoot: true,
          name: 'BookLoader',
        },
        {
          children: [
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'autoaccessorymisc',
              name: 'autoaccessorymisc',
            },
          ],
          deleted: false,
          depth: 0,
          fieldMappings: [

          ],
          id: 'autoaccessory',
          isRoot: true,
          lookups: [

          ],
          name: 'autoaccessory',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'autoaccessorymisc',
          isRoot: false,
          name: 'autoaccessorymisc',
        },
        {
          children: [
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'binocular',
              name: 'binocular',
            },
          ],
          deleted: false,
          depth: 0,
          fieldMappings: [

          ],
          id: 'cameraandphoto',
          isRoot: true,
          lookups: [

          ],
          name: 'cameraandphoto',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'binocular',
          isRoot: false,
          name: 'binocular',
        },
      ]);
    });

    test('should return correct form state for params passed for variationAttributes set as true', () => {
      const state = {
        'flow1-integration1': {
          response: [
            {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        id: 'commonAttributes',
                        name: 'commonAttributes',
                        children: [
                          {
                            id: 'Dimensions',
                            name: 'Dimensions',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Discovery',
                            name: 'Discovery',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Images',
                            name: 'Images',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                          {
                            id: 'Fulfillment',
                            name: 'Fulfillment',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [
                          {
                            extract: 'upccode',
                            generate: 'UPC',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'salesdescription',
                            generate: 'product_description',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'displayname',
                            generate: 'item_name',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'manufacturer',
                            generate: 'brand_name',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'manufacturer',
                            generate: 'manufacturer',
                            discardIfEmpty: true,
                          },
                          {
                            extract: 'mpn',
                            generate: 'part_number',
                            discardIfEmpty: true,
                          },
                          {
                            generate: 'update_delete',
                            hardCodedValue: 'Update',
                            dataType: 'string',
                          },
                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'BookLoader',
                        name: 'BookLoader',
                        children: [

                        ],
                        fieldMappings: [

                        ],
                      },
                      {
                        id: 'autoaccessory',
                        name: 'autoaccessory',
                        children: [
                          {
                            id: 'autoaccessorymisc',
                            name: 'autoaccessorymisc',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'cameraandphoto',
                        name: 'cameraandphoto',
                        children: [
                          {
                            id: 'binocular',
                            name: 'binocular',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                        lookups: [

                        ],
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [
                      {
                        id: 'Animal',
                        children: [
                          {
                            id: 'AnimalAccessories',
                            children: [

                            ],
                            fieldMappings: [
                              {
                                extract: 'atpleadtime',
                                generate: 'size',
                                discardIfEmpty: true,
                              },
                              {
                                extract: 'accountingbook',
                                generate: 'color',
                                discardIfEmpty: true,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        id: 'ArtAndCraftCategory',
                        children: [
                          {
                            id: 'ArtAndCraft',
                            children: [

                            ],
                            fieldMappings: [
                              {
                                extract: 'yes',
                                generate: 'material',
                                discardIfEmpty: true,
                              },
                              {
                                extract: 'hits',
                                generate: 'shape',
                                discardIfEmpty: true,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
            {
              operation: 'generatesMetaData',
              data: {
                categoryRelationshipData: [
                  {
                    id: 'autoaccessory',
                    name: 'Auto Accessory',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'autoaccessorymisc',
                        name: 'autoaccessorymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'autobattery',
                        name: 'autobattery',
                        isLeafNode: true,
                      },
                      {
                        id: 'autooil',
                        name: 'autooil',
                        isLeafNode: true,
                      },
                      {
                        id: 'Underwear',
                        name: 'Underwear [Moved to Clothing]',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'baby',
                    name: 'Baby',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'babyproducts',
                        name: 'babyproducts',
                        isLeafNode: true,
                      },
                      {
                        id: 'infanttoddlercarseat',
                        name: 'infanttoddlercarseat',
                        isLeafNode: true,
                      },
                      {
                        id: 'stroller',
                        name: 'stroller',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'beauty',
                    name: 'Beauty',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'beautymisc',
                        name: 'beautymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'bodycareproduct',
                        name: 'bodycareproduct',
                        isLeafNode: true,
                      },
                      {
                        id: 'conditioner',
                        name: 'conditioner',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'BookLoader',
                    name: 'Book Loader',
                    isLeafNode: true,
                    marketplace_domain: 'US',
                    children: [

                    ],
                  },
                  {
                    id: 'cameraandphoto',
                    name: 'Camera and Photo',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'binocular',
                        name: 'binocular',
                        isLeafNode: true,
                      },
                      {
                        id: 'blankmediaforcameras',
                        name: 'blankmediaforcameras',
                        isLeafNode: true,
                      },
                      {
                        id: 'camcorder',
                        name: 'camcorder',
                        isLeafNode: true,
                      },
                      {
                        id: 'Tripod',
                        name: 'Tripod [Deprecated]',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'clothing',
                    name: 'Clothing',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'PROTECTIVE_GLOVE',
                        name: 'PROTECTIVE_GLOVE',
                        isLeafNode: true,
                      },
                      {
                        id: 'accessory',
                        name: 'accessory',
                        isLeafNode: true,
                      },
                      {
                        id: 'childrenscostume',
                        name: 'childrenscostume',
                        isLeafNode: true,
                      },
                      {
                        id: 'vest',
                        name: 'vest',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'coins',
                    name: 'Coins',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'Bullion',
                        name: 'Bullion',
                        isLeafNode: true,
                      },
                      {
                        id: 'Coins',
                        name: 'Coins',
                        isLeafNode: true,
                      },
                      {
                        id: 'CollectibleCoins',
                        name: 'CollectibleCoins',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'FoodServiceAndJanSan',
                    name: 'Food Service and Jan San',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'FoodServiceSupply',
                        name: 'FoodServiceSupply',
                        isLeafNode: true,
                      },
                      {
                        id: 'JanitorialSupply',
                        name: 'JanitorialSupply',
                        isLeafNode: true,
                      },
                    ],
                  },
                ],

              },
            },
          ],
          collapseStatus: {
            collapsed: true,
            collapseAction: 'collapse',
          },
          filters: {
            attributes: {
              preferred: true,
              optional: true,
            },
            mappingFilter: 'all',
          },
          uiAssistant: 'amazon',
        },
        'integrationId-flowId-sectionId': {
          dummy: 'data',
        },
        'flow2-integration2': {},
      };

      expect(selector(state, 'integration1', 'flow1')).toEqual([
        {
          children: [
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Dimensions',
              name: 'Dimensions',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Discovery',
              name: 'Discovery',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Images',
              name: 'Images',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Fulfillment',
              name: 'Fulfillment',
            },
          ],
          deleted: false,
          depth: 0,
          fieldMappings: [
            {
              discardIfEmpty: true,
              extract: 'upccode',
              generate: 'UPC',
            },
            {
              discardIfEmpty: true,
              extract: 'salesdescription',
              generate: 'product_description',
            },
            {
              discardIfEmpty: true,
              extract: 'displayname',
              generate: 'item_name',
            },
            {
              discardIfEmpty: true,
              extract: 'manufacturer',
              generate: 'brand_name',
            },
            {
              discardIfEmpty: true,
              extract: 'manufacturer',
              generate: 'manufacturer',
            },
            {
              discardIfEmpty: true,
              extract: 'mpn',
              generate: 'part_number',
            },
            {
              dataType: 'string',
              generate: 'update_delete',
              hardCodedValue: 'Update',
            },
          ],
          id: 'commonAttributes',
          isRoot: true,
          lookups: [

          ],
          name: 'commonAttributes',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'Dimensions',
          isRoot: false,
          name: 'Dimensions',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'Discovery',
          isRoot: false,
          name: 'Discovery',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'Images',
          isRoot: false,
          name: 'Images',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'Fulfillment',
          isRoot: false,
          name: 'Fulfillment',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 0,
          fieldMappings: [

          ],
          id: 'BookLoader',
          isRoot: true,
          name: 'BookLoader',
        },
        {
          children: [
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'autoaccessorymisc',
              name: 'autoaccessorymisc',
            },
          ],
          deleted: false,
          depth: 0,
          fieldMappings: [

          ],
          id: 'autoaccessory',
          isRoot: true,
          lookups: [

          ],
          name: 'autoaccessory',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'autoaccessorymisc',
          isRoot: false,
          name: 'autoaccessorymisc',
        },
        {
          children: [
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'binocular',
              name: 'binocular',
            },
          ],
          deleted: false,
          depth: 0,
          fieldMappings: [

          ],
          id: 'cameraandphoto',
          isRoot: true,
          lookups: [

          ],
          name: 'cameraandphoto',
        },
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [

          ],
          id: 'binocular',
          isRoot: false,
          name: 'binocular',
        },
      ]);
    });
  });

  describe('integrationApps settings mkCategoryGeneratesData test', () => {
    const selector = selectors.mkCategoryMappingGeneratesMetadata();

    test('should not throw exception for bad params', () => {
      expect(selector()).toEqual(null);
      expect(selector({})).toEqual([]);
      expect(selector(null)).toEqual(null);
    });

    test('should return correct form state for params passed for variationAttributes set as false', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration1', 'flow1', amazonCategoryMappings));

      expect(selector(state, 'integration1', 'flow1')).toEqual([
        {
          children: [],
          deleted: false,
          depth: 0,
          fields: [
            {
              description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
              filterType: 'required',
              id: 'item_sku',
              name: 'Seller SKU',
              options: [],
              type: 'input',
            },
            {
              description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
              filterType: 'required',
              id: 'item_name',
              name: 'Product Name',
              options: [],
              type: 'input',
            },
            {
              description: 'A standard, alphanumeric string that uniquely identifies the product.',
              filterType: 'preferred',
              id: 'ASIN',
              name: 'ASIN',
              options: [],
              type: 'input',
            },
            {
              description: 'A standard, alphanumeric string that uniquely identifies the product.',
              filterType: 'preferred',
              id: 'UPC',
              name: 'UPC',
              options: [],
              type: 'input',
            },
            {
              description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
              filterType: 'optional',
              id: 'item_length_unit_of_measure',
              name: 'Item Length Unit Of Measure',
              options: [
                {
                  id: 'CM',
                  text: 'CM',
                },
                {
                  id: 'FT',
                  text: 'FT',
                },
                {
                  id: 'IN',
                  text: 'IN',
                },
                {
                  id: 'M',
                  text: 'M',
                },
                {
                  id: 'MM',
                  text: 'MM',
                },
              ],
              type: 'select',
            },
          ],
          id: 'commonAttributes',
          isLeafNode: false,
          isRoot: true,
          marketplace_domain: 'US',
          name: 'Common',
          variation_attributes: [],
          variation_themes: [],
        },
      ]);
    });

    test('should return correct form state for params passed for variationAttributes set as true', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration1', 'flow1', walmartCategoryMappings));

      expect(selector(state, 'integration1', 'flow1')).toEqual([
        {
          children: [
            {
              children: [],
              fields: [
                {
                  description: 'Input the weight of the individual selling unit.',
                  filterType: 'optional',
                  id: 'ShippingWeight.measure',
                  name: 'Shipping Weight > Measure',
                  options: [
                    {
                      id: 'lb',
                      text: 'lb',
                    },
                  ],
                  type: 'select',
                },
                {
                  description: 'The weight of the fully assembled product. NOTE: This information is shown on the item page.',
                  filterType: 'optional',
                  id: 'assembledProductWeight.unit',
                  name: 'Assembled Product Weight > Unit',
                  options: [
                    {
                      id: 'oz',
                      text: 'oz',
                    },
                    {
                      id: 'lb',
                      text: 'lb',
                    },
                    {
                      id: 'g',
                      text: 'g',
                    },
                    {
                      id: 'kg',
                      text: 'kg',
                    },
                  ],
                  type: 'select',
                },
              ],
              id: 'Dimensions',
              isLeafNode: false,
              name: 'Dimensions',
              variation_attributes: [],
            },
            {
              children: [],
              fields: [
                {
                  description: 'Attribute name corresponding to the swatch.',
                  filterType: 'conditional',
                  id: 'swatchImage.1.swatchVariantAttribute',
                  name: 'Swatch Images > Swatch Variant Attribute 1',
                  options: [],
                  type: 'select',
                },
                {
                  description: 'Attribute name corresponding to the swatch.',
                  filterType: 'conditional',
                  id: 'swatchImage.2.swatchVariantAttribute',
                  name: 'Swatch Images > Swatch Variant Attribute 2',
                  options: [],
                  type: 'select',
                },
                {
                  description: 'Attribute name corresponding to the swatch.',
                  filterType: 'conditional',
                  id: 'swatchImage.3.swatchVariantAttribute',
                  name: 'Swatch Images > Swatch Variant Attribute 3',
                  options: [],
                  type: 'select',
                },
                {
                  description: 'Attribute name corresponding to the swatch.',
                  filterType: 'conditional',
                  id: 'swatchImage.4.swatchVariantAttribute',
                  name: 'Swatch Images > Swatch Variant Attribute 4',
                  options: [],
                  type: 'select',
                },
                {
                  description: 'Attribute name corresponding to the swatch.',
                  filterType: 'conditional',
                  id: 'swatchImage.5.swatchVariantAttribute',
                  name: 'Swatch Images > Swatch Variant Attribute 5',
                  options: [],
                  type: 'select',
                },
              ],
              id: 'Variation',
              isLeafNode: false,
              name: 'Variation',
              variation_attributes: [],
            },
          ],
          deleted: false,
          depth: 0,
          fields: [
            {
              description: 'This is a seven digit code used in Taxware that enables customers to save money on sales tax based on their state of residence and the properties of the product. To learn how to select the correct code, you may watch this video: https://vimeo.com/164512893 ',
              filterType: 'optional',
              id: 'ProductTaxCode',
              name: 'Product Tax Code',
              options: [],
              type: 'input',
            },
            {
              description: 'Key features will appear as bulleted text on the item page and in search results. Key features help the user understand the benefits of the product with a simple and clean format. We highly recommended using three or more key features.',
              filterType: 'preferred',
              id: 'keyFeaturesValue.5',
              name: 'Key Features 5',
              options: [],
              type: 'input',
            },
          ],
          id: 'commonAttributes',
          isLeafNode: false,
          isRoot: true,
          name: 'Common',
          variation_attributes: [],
        },
        {
          children: [],
          deleted: false,
          depth: 1,
          fields: [
            {
              description: 'Input the weight of the individual selling unit.',
              filterType: 'optional',
              id: 'ShippingWeight.measure',
              name: 'Shipping Weight > Measure',
              options: [
                {
                  id: 'lb',
                  text: 'lb',
                },
              ],
              type: 'select',
            },
            {
              description: 'The weight of the fully assembled product. NOTE: This information is shown on the item page.',
              filterType: 'optional',
              id: 'assembledProductWeight.unit',
              name: 'Assembled Product Weight > Unit',
              options: [
                {
                  id: 'oz',
                  text: 'oz',
                },
                {
                  id: 'lb',
                  text: 'lb',
                },
                {
                  id: 'g',
                  text: 'g',
                },
                {
                  id: 'kg',
                  text: 'kg',
                },
              ],
              type: 'select',
            },
          ],
          id: 'Dimensions',
          isLeafNode: false,
          isRoot: false,
          name: 'Dimensions',
          variation_attributes: [],
        },
        {
          children: [],
          deleted: false,
          depth: 1,
          fields: [
            {
              description: 'Attribute name corresponding to the swatch.',
              filterType: 'conditional',
              id: 'swatchImage.1.swatchVariantAttribute',
              name: 'Swatch Images > Swatch Variant Attribute 1',
              options: [],
              type: 'select',
            },
            {
              description: 'Attribute name corresponding to the swatch.',
              filterType: 'conditional',
              id: 'swatchImage.2.swatchVariantAttribute',
              name: 'Swatch Images > Swatch Variant Attribute 2',
              options: [],
              type: 'select',
            },
            {
              description: 'Attribute name corresponding to the swatch.',
              filterType: 'conditional',
              id: 'swatchImage.3.swatchVariantAttribute',
              name: 'Swatch Images > Swatch Variant Attribute 3',
              options: [],
              type: 'select',
            },
            {
              description: 'Attribute name corresponding to the swatch.',
              filterType: 'conditional',
              id: 'swatchImage.4.swatchVariantAttribute',
              name: 'Swatch Images > Swatch Variant Attribute 4',
              options: [],
              type: 'select',
            },
            {
              description: 'Attribute name corresponding to the swatch.',
              filterType: 'conditional',
              id: 'swatchImage.5.swatchVariantAttribute',
              name: 'Swatch Images > Swatch Variant Attribute 5',
              options: [],
              type: 'select',
            },
          ],
          id: 'Variation',
          isLeafNode: false,
          isRoot: false,
          name: 'Variation',
          variation_attributes: [],
        },
      ]);
    });
  });

  describe('integrationApps settings mkCategoryMappingsForSection test', () => {
    const selector = selectors.mkCategoryMappingsForSection();

    test('should not throw exception for bad params', () => {
      expect(selector()).toEqual([]);
      expect(selector({})).toEqual([]);
      expect(selector(null)).toEqual([]);
    });

    test('should return emptyArray when state is empty', () => {
      expect(selector({'flow-integration': {}}, 'integration', 'flow', 'mappingId')).toEqual([]);
      expect(selector({'flow-integration': {mappings: {}}}, 'integration', 'flow', 'mappingId')).toEqual([]);
    });

    test('should not throw exception for bad params', () => {
      const state = {
        'flow-integration': {
          mappings: {
            mappingId: {
              fields: [{
                a: 'b',
              }],
              children: [{
                id: 'child1',
                name: 'Child',
                fields: [{
                  c: 'd',
                }],
              }],
            },
          },
        },
      };

      expect(selector(state, 'integration', 'flow', 'mappingId')).toEqual({
        fields: [{
          a: 'b',
        }],
        children: [{
          id: 'child1',
          name: 'Child',
          fields: [{
            c: 'd',
          }],
        }],
      });
    });
  });

  describe('integrationApps settings mkCategoryMappingGenerateFields test', () => {
    const selector = selectors.mkCategoryMappingGenerateFields();

    test('should not throw exception for bad params', () => {
      expect(selector()).toEqual();
      expect(selector({})).toEqual();
      expect(selector(null)).toEqual();
    });

    test('should return correct form state for params passed for variationAttributes set as false', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration1', 'flow1', amazonCategoryMappings));

      expect(selector(state, 'integration1', 'flow1', { sectionId: 'commonAttributes' })).toEqual(
        {
          children: [

          ],
          deleted: false,
          depth: 0,
          fields: [
            {
              description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
              filterType: 'required',
              id: 'item_sku',
              name: 'Seller SKU',
              options: [

              ],
              type: 'input',
            },
            {
              description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
              filterType: 'required',
              id: 'item_name',
              name: 'Product Name',
              options: [

              ],
              type: 'input',
            },
            {
              description: 'A standard, alphanumeric string that uniquely identifies the product.',
              filterType: 'preferred',
              id: 'ASIN',
              name: 'ASIN',
              options: [

              ],
              type: 'input',
            },
            {
              description: 'A standard, alphanumeric string that uniquely identifies the product.',
              filterType: 'preferred',
              id: 'UPC',
              name: 'UPC',
              options: [

              ],
              type: 'input',
            },
            {
              description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
              filterType: 'optional',
              id: 'item_length_unit_of_measure',
              name: 'Item Length Unit Of Measure',
              options: [
                {
                  id: 'CM',
                  text: 'CM',
                },
                {
                  id: 'FT',
                  text: 'FT',
                },
                {
                  id: 'IN',
                  text: 'IN',
                },
                {
                  id: 'M',
                  text: 'M',
                },
                {
                  id: 'MM',
                  text: 'MM',
                },
              ],
              type: 'select',
            },
          ],
          id: 'commonAttributes',
          isLeafNode: false,
          isRoot: true,
          marketplace_domain: 'US',
          name: 'Common',
          variation_attributes: [

          ],
          variation_themes: [

          ],
        }
      );
    });

    test('should return correct form state for params passed for variationAttributes set as true', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration1', 'flow1', walmartCategoryMappings));

      expect(selector(state, 'integration1', 'flow1', { sectionId: 'Variation' })).toEqual({
        children: [

        ],
        deleted: false,
        depth: 1,
        fields: [
          {
            description: 'Attribute name corresponding to the swatch.',
            filterType: 'conditional',
            id: 'swatchImage.1.swatchVariantAttribute',
            name: 'Swatch Images > Swatch Variant Attribute 1',
            options: [

            ],
            type: 'select',
          },
          {
            description: 'Attribute name corresponding to the swatch.',
            filterType: 'conditional',
            id: 'swatchImage.2.swatchVariantAttribute',
            name: 'Swatch Images > Swatch Variant Attribute 2',
            options: [

            ],
            type: 'select',
          },
          {
            description: 'Attribute name corresponding to the swatch.',
            filterType: 'conditional',
            id: 'swatchImage.3.swatchVariantAttribute',
            name: 'Swatch Images > Swatch Variant Attribute 3',
            options: [

            ],
            type: 'select',
          },
          {
            description: 'Attribute name corresponding to the swatch.',
            filterType: 'conditional',
            id: 'swatchImage.4.swatchVariantAttribute',
            name: 'Swatch Images > Swatch Variant Attribute 4',
            options: [

            ],
            type: 'select',
          },
          {
            description: 'Attribute name corresponding to the swatch.',
            filterType: 'conditional',
            id: 'swatchImage.5.swatchVariantAttribute',
            name: 'Swatch Images > Swatch Variant Attribute 5',
            options: [

            ],
            type: 'select',
          },
        ],
        id: 'Variation',
        isLeafNode: false,
        isRoot: false,
        name: 'Variation',
        variation_attributes: [

        ],
      });
    });
  });

  describe('integrationApps settings mkMappingsForCategory test', () => {
    const selector = selectors.mkMappingsForCategory();

    test('should not throw exception for bad params', () => {
      expect(selector()).toEqual();
      expect(selector({})).toEqual();
      expect(selector(null)).toEqual();
    });

    test('should return correct form state for params passed for variationAttributes set as false', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration1', 'flow1', amazonCategoryMappings));

      expect(selector(state, 'integration1', 'flow1', { sectionId: 'commonAttributes' })).toEqual(
        {
          children: [
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Dimensions',
              name: 'Dimensions',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Discovery',
              name: 'Discovery',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Images',
              name: 'Images',
            },
            {
              children: [

              ],
              fieldMappings: [

              ],
              id: 'Fulfillment',
              name: 'Fulfillment',
            },
          ],
          deleted: false,
          depth: 0,
          fieldMappings: [
            {
              description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
              discardIfEmpty: true,
              extract: 'SKU',
              filterType: 'required',
              generate: 'item_sku',
              name: 'Seller SKU',
            },
            {
              description: 'A short title for the product. This will be displayed in bold on the product page and in the title bar of the browser window.',
              discardIfEmpty: true,
              extract: 'displayname',
              filterType: 'required',
              generate: 'item_name',
              name: 'Product Name',
            },
            {
              description: 'A standard, alphanumeric string that uniquely identifies the product.',
              discardIfEmpty: true,
              extract: '',
              filterType: 'preferred',
              generate: 'ASIN',
              name: 'ASIN',
            },
            {
              description: 'A standard, alphanumeric string that uniquely identifies the product.',
              discardIfEmpty: true,
              extract: 'upccode',
              filterType: 'preferred',
              generate: 'UPC',
              name: 'UPC',
            },
            {
              description: 'The unit of measure used to describe the dimensions (width, length, height) of the product, expressed in centimeters, meters, inches, or feet. Required if item dimensions are provided.',
              discardIfEmpty: true,
              extract: '',
              filterType: 'optional',
              generate: 'item_length_unit_of_measure',
              name: 'Item Length Unit Of Measure',
            },
          ],
          id: 'commonAttributes',
          isRoot: true,
          lookups: [

          ],
          name: 'Common',
        }
      );
    });

    test('should return correct form state for params passed for variationAttributes set as true', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration1', 'flow1', walmartCategoryMappings));

      expect(selector(state, 'integration1', 'flow1', { sectionId: 'Variation' })).toEqual(
        {
          children: [

          ],
          deleted: false,
          depth: 1,
          fieldMappings: [
            {
              description: 'Attribute name corresponding to the swatch.',
              discardIfEmpty: true,
              extract: '',
              filterType: 'conditional',
              generate: 'swatchImage.1.swatchVariantAttribute',
              name: 'Swatch Images > Swatch Variant Attribute 1',
            },
            {
              description: 'Attribute name corresponding to the swatch.',
              discardIfEmpty: true,
              extract: '',
              filterType: 'conditional',
              generate: 'swatchImage.2.swatchVariantAttribute',
              name: 'Swatch Images > Swatch Variant Attribute 2',
            },
            {
              description: 'Attribute name corresponding to the swatch.',
              discardIfEmpty: true,
              extract: '',
              filterType: 'conditional',
              generate: 'swatchImage.3.swatchVariantAttribute',
              name: 'Swatch Images > Swatch Variant Attribute 3',
            },
            {
              description: 'Attribute name corresponding to the swatch.',
              discardIfEmpty: true,
              extract: '',
              filterType: 'conditional',
              generate: 'swatchImage.4.swatchVariantAttribute',
              name: 'Swatch Images > Swatch Variant Attribute 4',
            },
            {
              description: 'Attribute name corresponding to the swatch.',
              discardIfEmpty: true,
              extract: '',
              filterType: 'conditional',
              generate: 'swatchImage.5.swatchVariantAttribute',
              name: 'Swatch Images > Swatch Variant Attribute 5',
            },
          ],
          id: 'Variation',
          isRoot: false,
          name: 'Variation',
        }
      );
    });
  });

  describe('integrationApps settings mkCategoryMappingsExtractsMetadata', () => {
    const selector = selectors.mkCategoryMappingsExtractsMetadata();

    test('should not throw exception for bad params', () => {
      expect(selector()).toEqual([]);
      expect(selector({})).toEqual([]);
      expect(selector(null)).toEqual([]);
    });
    test('should return correct data for amazon category mappings', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration', 'flow', amazonCategoryMappings));

      expect(selector(state, 'integration', 'flow')).toEqual(
        [
          {
            id: 'hits',
            name: '# Times Viewed',
            type: 'integer',
          },
          {
            id: 'atpleadtime',
            name: 'ATP Lead Time',
            type: 'float',
          },
          {
            id: 'accountingbook',
            name: 'Accounting Book',
            type: 'select',
          },
          {
            id: 'accountingbookamortization',
            name: 'Accounting Book Amortization Schedule',
            type: 'select',
          },
          {
            id: 'accountingbookrevrecschedule',
            name: 'Accounting Book Rev. Rec. Schedule',
            type: 'select',
          },
          {
            id: 'custitem_celigo_ebay_list_add_fee',
            name: 'Add Listing Fee',
            type: 'text',
          },
          {
            id: 'custitem_celigo_etail_channel',
            name: 'eTail Channel (2)',
            type: 'multiselect',
          },
        ]
      );
    });
  });

  describe('integrationApps settings mkPendingCategoryMappings', () => {
    const selector = selectors.mkPendingCategoryMappings();

    test('should not throw exception for bad params', () => {
      expect(selector()).toEqual(null);
      expect(selector({})).toEqual(null);
      expect(selector(null)).toEqual(null);
    });
    test('should return correct data for amazon category mappings', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration', 'flow', amazonCategoryMappings));

      expect(selector(state, 'integration', 'flow')).toEqual({
        basicMappings: {
          recordMappings: [
            {
              children: [
                {
                  children: [

                  ],
                  fieldMappings: [

                  ],
                  id: 'Dimensions',
                  name: 'Dimensions',
                },
                {
                  children: [

                  ],
                  fieldMappings: [

                  ],
                  id: 'Discovery',
                  name: 'Discovery',
                },
                {
                  children: [

                  ],
                  fieldMappings: [

                  ],
                  id: 'Images',
                  name: 'Images',
                },
                {
                  children: [

                  ],
                  fieldMappings: [

                  ],
                  id: 'Fulfillment',
                  name: 'Fulfillment',
                },
              ],
              fieldMappings: [
                {
                  discardIfEmpty: true,
                  extract: 'SKU',
                  generate: 'item_sku',
                },
                {
                  discardIfEmpty: true,
                  extract: 'upccode',
                  generate: 'UPC',
                },
                {
                  discardIfEmpty: true,
                  extract: 'salesdescription',
                  generate: 'product_description',
                },
                {
                  discardIfEmpty: true,
                  extract: 'displayname',
                  generate: 'item_name',
                },
                {
                  discardIfEmpty: true,
                  extract: 'manufacturer',
                  generate: 'brand_name',
                },
              ],
              id: 'commonAttributes',
              lookups: [

              ],
              name: 'Common',
            },
          ],
        },
        variationMappings: {
          recordMappings: [

          ],
        },
      });
    });

    test('should return correct data for amazon category mappings', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration', 'flow', amazonCategoryMappings));

      state['flow-integration'].mappings = {
        'flow-commonAttributes-0': {
          mappings: [{
            extract: 'first',
            generate: 'second',
          }],
        },
        'flow-Dimensions-1': {
          mappings: [{
            extract: 'dimensions_e',
            generate: 'dimensions_g',
          }],
        },
      };
      expect(selector(state, 'integration', 'flow')).toEqual(
        {
          basicMappings: {
            recordMappings: [
              {
                children: [
                  {
                    children: [

                    ],
                    fieldMappings: [
                      {
                        extract: 'dimensions_e',
                        generate: 'dimensions_g',
                      },
                    ],
                    id: 'Dimensions',
                    name: 'Dimensions',
                  },
                  {
                    children: [

                    ],
                    fieldMappings: [

                    ],
                    id: 'Discovery',
                    name: 'Discovery',
                  },
                  {
                    children: [

                    ],
                    fieldMappings: [

                    ],
                    id: 'Images',
                    name: 'Images',
                  },
                  {
                    children: [

                    ],
                    fieldMappings: [

                    ],
                    id: 'Fulfillment',
                    name: 'Fulfillment',
                  },
                ],
                fieldMappings: [
                  {
                    extract: 'first',
                    generate: 'second',
                  },
                ],
                id: 'commonAttributes',
                lookups: [

                ],
                name: 'Common',
              },
            ],
          },
          variationMappings: {
            recordMappings: [

            ],
          },
        }
      );
    });
  });

  describe('integrationApps settings mkCategoryMappingsChanged', () => {
    const selector = selectors.mkCategoryMappingsChanged();

    test('should not throw exception for bad params', () => {
      expect(selector()).toEqual(false);
      expect(selector({})).toEqual(false);
      expect(selector(null)).toEqual(false);
    });
    test('should return false when mappings are not changed', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration', 'flow', amazonCategoryMappings));

      expect(selector(state, 'integration', 'flow')).toEqual(false);
    });

    test('should return true when mappings changed', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration', 'flow', amazonCategoryMappings));

      state['flow-integration'].mappings = {
        'flow-commonAttributes-0': {
          mappings: [{
            extract: 'first',
            generate: 'second',
          }],
        },
        'flow-Dimensions-1': {
          mappings: [{
            extract: 'dimensions_e',
            generate: 'dimensions_g',
          }],
        },
      };
      expect(selector(state, 'integration', 'flow')).toEqual(true);
    });
  });

  describe('integrationApps settings categoryMappingSaveStatus test', () => {
    test('should not throw exception for bad params', () => {
      expect(selectors.categoryMappingSaveStatus()).toEqual(null);
      expect(selectors.categoryMappingSaveStatus({})).toEqual(null);
      expect(selectors.categoryMappingSaveStatus(null)).toEqual(null);
    });

    test('should return correct saveStatus value for valid integration and flow', () => {
      const state = {
        'flow-integration': {
          saveStatus: 'saved',
        },
      };

      expect(selectors.categoryMappingSaveStatus(state, 'integration', 'flow')).toEqual('saved');
    });
  });

  describe('integrationApps settings integrationAppAddOnState test', () => {
    test('should not throw exception for bad params', () => {
      expect(selectors.integrationAppAddOnState()).toEqual({});
      expect(selectors.integrationAppAddOnState({})).toEqual({});
      expect(selectors.integrationAppAddOnState(null)).toEqual({});
    });

    test('should return correct saveStatus value for valid integration and flow', () => {
      const state = {
        'integration-addOns': {
          addons: {
            data: 'dummy',
          },
        },
      };

      expect(selectors.integrationAppAddOnState(state, 'integration', 'flow')).toEqual({
        addons: {
          data: 'dummy',
        },
      });
    });
  });

  describe('integrationApps settings integrationAppMappingMetadata test', () => {
    test('should not throw exception for bad params', () => {
      expect(selectors.integrationAppMappingMetadata()).toEqual({});
      expect(selectors.integrationAppMappingMetadata({})).toEqual({});
      expect(selectors.integrationAppMappingMetadata(null)).toEqual({});
    });

    test('should return correct saveStatus value for valid integration and flow', () => {
      const state = {
        integration: {
          meta: {
            data: 'dummy',
          },
        },
      };

      expect(selectors.integrationAppMappingMetadata(state, 'integration', 'flow')).toEqual({
        meta: {
          data: 'dummy',
        },
      });
    });
  });

  describe('integrationApps settings checkUpgradeRequested test', () => {
    test('should not throw exception for bad params', () => {
      expect(selectors.checkUpgradeRequested()).toEqual(false);
      expect(selectors.checkUpgradeRequested({})).toEqual(false);
      expect(selectors.checkUpgradeRequested(null)).toEqual(false);
    });

    test('should return correct saveStatus value for valid integration and flow', () => {
      const state = {
        integration: {
          meta: {
            data: 'dummy',
          },
          redirectTo: '/dashboard',
        },
        licenseId: true,
        licenseId2: false,
      };

      expect(selectors.checkUpgradeRequested(state, 'licenseId')).toEqual(true);
      expect(selectors.checkUpgradeRequested(state, 'licenseId2')).toEqual(false);
    });
  });
});

