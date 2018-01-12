'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ad = mongoose.model('Ad'),
  Categoryshop = mongoose.model('Categoryshop'),
  Shop = mongoose.model('Shop'),
  Categoryproduct = mongoose.model('Categoryproduct'),
  Product = mongoose.model('Product'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  ads1,ads2,ads3,
  categoryshop,
  shop1,shop2,shop3,shop4,shop5,
  token;

/**
 * Shop routes tests
 */
describe('Customer Home Stories Test', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'admin',
      password: 'P@ssw0rd1234'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local',
      roles: ['admin']
    });

    ads1 = new Ad({
      image: "./assets/imgs/ads/ads1.png",
      isvideo: true,
      videoid: "###",
      user: user
    });

    ads2 = new Ad({
      image: "./assets/imgs/ads/ads2.png",
      isvideo: false,
      videoid: '',
      user: user
    });

    ads3 = new Ad({
      image: "./assets/imgs/ads/ads3.png",
      isvideo: true,
      videoid: "###",
      user: user
    });

    categoryshop = new Categoryshop({
      name: 'อาหารและเครื่องดื่ม',
      image: './assets/imgs/Catagory/cat0.png'
    });

    shop1 = new Shop({
      name: 'ครัวคุณโก๋1',
      name_eng: 'Shop name english',
      detail: 'Coffice Idea Space',
      tel: '0894447208',
      email: 'test@gmail.com',
      facebook: 'facebook.com',
      line: '@lineid',
      address: {
        address: '88/8',
        addressdetail: 'ตรงข้าม big c',
        subdistinct: 'ลำลูกกา',
        distinct: 'ลำลูกกา',
        province: 'ปทุมธานี',
        postcode: '12150',
        lat: '13.9338949',
        lng: '100.6827773'
      },
      items: [],
      times: [{
        description: 'ทุกวัน',
        timestart: '07.00',
        timeend: '20.00',
        days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      }],
      coverimage: 'http://www.hardrock.com/cafes/amsterdam/files/2308/LegendsRoom.jpg',
      promoteimage: ["http://soimilk.com/sites/default/files/u143056/13528419_497821473741911_1179151975926373336_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/841128_788347794565227_8687025660509098200_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/11402392_840851149314891_2781537114366370680_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/unnamed.jpg",
        "http://soimilk.com/sites/default/files/u143056/2458.jpg"
      ],
      isactiveshop: false,
      issendmail: false,
      importform: 'manual',
      categories: [categoryshop],
      user: user
    });

    shop2 = new Shop({
      name: 'ครัวคุณโก๋2',
      name_eng: 'Shop name english',
      detail: 'Coffice Idea Space',
      tel: '0894447208',
      email: 'test@gmail.com',
      facebook: 'facebook.com',
      line: '@lineid',
      address: {
        address: '88/8',
        addressdetail: 'ตรงข้าม big c',
        subdistinct: 'ลำลูกกา',
        distinct: 'ลำลูกกา',
        province: 'ปทุมธานี',
        postcode: '12150',
        lat: '13.9338949',
        lng: '100.6827773'
      },
      items: [],
      times: [{
        description: 'ทุกวัน',
        timestart: '07.00',
        timeend: '20.00',
        days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      }],
      coverimage: 'http://www.hardrock.com/cafes/amsterdam/files/2308/LegendsRoom.jpg',
      promoteimage: ["http://soimilk.com/sites/default/files/u143056/13528419_497821473741911_1179151975926373336_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/841128_788347794565227_8687025660509098200_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/11402392_840851149314891_2781537114366370680_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/unnamed.jpg",
        "http://soimilk.com/sites/default/files/u143056/2458.jpg"
      ],
      isactiveshop: false,
      issendmail: false,
      importform: 'manual',
      categories: [categoryshop],
      user: user
    });

    shop3 = new Shop({
      name: 'ครัวคุณโก๋3',
      name_eng: 'Shop name english',
      detail: 'Coffice Idea Space',
      tel: '0894447208',
      email: 'test@gmail.com',
      facebook: 'facebook.com',
      line: '@lineid',
      address: {
        address: '88/8',
        addressdetail: 'ตรงข้าม big c',
        subdistinct: 'ลำลูกกา',
        distinct: 'ลำลูกกา',
        province: 'ปทุมธานี',
        postcode: '12150',
        lat: '13.9338949',
        lng: '100.6827773'
      },
      items: [],
      times: [{
        description: 'ทุกวัน',
        timestart: '07.00',
        timeend: '20.00',
        days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      }],
      coverimage: 'http://www.hardrock.com/cafes/amsterdam/files/2308/LegendsRoom.jpg',
      promoteimage: ["http://soimilk.com/sites/default/files/u143056/13528419_497821473741911_1179151975926373336_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/841128_788347794565227_8687025660509098200_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/11402392_840851149314891_2781537114366370680_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/unnamed.jpg",
        "http://soimilk.com/sites/default/files/u143056/2458.jpg"
      ],
      isactiveshop: false,
      issendmail: false,
      importform: 'manual',
      categories: [categoryshop],
      user: user
    });

    shop4 = new Shop({
      name: 'ครัวคุณโก๋4',
      name_eng: 'Shop name english',
      detail: 'Coffice Idea Space',
      tel: '0894447208',
      email: 'test@gmail.com',
      facebook: 'facebook.com',
      line: '@lineid',
      address: {
        address: '88/8',
        addressdetail: 'ตรงข้าม big c',
        subdistinct: 'ลำลูกกา',
        distinct: 'ลำลูกกา',
        province: 'ปทุมธานี',
        postcode: '12150',
        lat: '13.9338949',
        lng: '100.6827773'
      },
      items: [],
      times: [{
        description: 'ทุกวัน',
        timestart: '07.00',
        timeend: '20.00',
        days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      }],
      coverimage: 'http://www.hardrock.com/cafes/amsterdam/files/2308/LegendsRoom.jpg',
      promoteimage: ["http://soimilk.com/sites/default/files/u143056/13528419_497821473741911_1179151975926373336_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/841128_788347794565227_8687025660509098200_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/11402392_840851149314891_2781537114366370680_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/unnamed.jpg",
        "http://soimilk.com/sites/default/files/u143056/2458.jpg"
      ],
      isactiveshop: false,
      issendmail: false,
      importform: 'manual',
      categories: [categoryshop],
      user: user
    });

    shop5 = new Shop({
      name: 'ครัวคุณโก๋5',
      name_eng: 'Shop name english',
      detail: 'Coffice Idea Space',
      tel: '0894447208',
      email: 'test@gmail.com',
      facebook: 'facebook.com',
      line: '@lineid',
      address: {
        address: '88/8',
        addressdetail: 'ตรงข้าม big c',
        subdistinct: 'ลำลูกกา',
        distinct: 'ลำลูกกา',
        province: 'ปทุมธานี',
        postcode: '12150',
        lat: '13.9338949',
        lng: '100.6827773'
      },
      items: [],
      times: [{
        description: 'ทุกวัน',
        timestart: '07.00',
        timeend: '20.00',
        days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      }],
      coverimage: 'http://www.hardrock.com/cafes/amsterdam/files/2308/LegendsRoom.jpg',
      promoteimage: ["http://soimilk.com/sites/default/files/u143056/13528419_497821473741911_1179151975926373336_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/841128_788347794565227_8687025660509098200_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/11402392_840851149314891_2781537114366370680_o.jpg",
        "http://soimilk.com/sites/default/files/u143056/unnamed.jpg",
        "http://soimilk.com/sites/default/files/u143056/2458.jpg"
      ],
      isactiveshop: false,
      issendmail: false,
      importform: 'manual',
      categories: [categoryshop],
      user: user
    });

    token = '';
    // Save a user to the test db and create new Shop
    user.save(function () {
      ads1.save();
      ads2.save();
      ads3.save();
      categoryshop.save(function () {
        shop1.save();
        shop2.save();
        shop3.save();
        shop4.save();
        shop5.save();
        done();
      });

    });
  });


  it('should be get Home data collection', function (done) {
    agent.get('/api/customer/home')
      .end(function (homeGetErr, homeGetRes) {
        // Handle Products save error
        if (homeGetErr) {
          return done(homeGetErr);
        }

        // Get Products list
        var home = homeGetRes.body;

        // Set assertions
        home.ads.should.not.be.empty();
        home.ads.items.should.be.instanceof(Array).and.have.lengthOf(3);
        home.hotprices.should.not.be.empty();
        home.categories.should.not.be.empty();
        home.categories.items.should.be.instanceof(Array).and.have.lengthOf(1);
        home.shops.should.not.be.empty();
        home.shops.should.be.instanceof(Array).and.have.lengthOf(3);
        home.shops[0].title.should.be.equal('NEAR_BY');
        home.shops[0].items.should.be.instanceof(Array).and.have.lengthOf(4);
        home.shops[1].title.should.be.equal('POPULAR');
        home.shops[1].items.should.be.instanceof(Array).and.have.lengthOf(4);
        home.shops[2].title.should.be.equal('FAVORITE');
        home.shops[2].items.should.be.instanceof(Array).and.have.lengthOf(4);
        // Call the assertion callback
        done();
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Categoryshop.remove().exec(function(){
        Shop.remove().exec(function(){
          Ad.remove().exec(done);
        });
      });
    });
  });
});
