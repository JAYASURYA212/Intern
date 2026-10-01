package com.mobilemart.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.mobilemart.model.Brand;
import com.mobilemart.model.Product;
import com.mobilemart.model.ProductImage;
import com.mobilemart.model.SearchHistory;
import com.mobilemart.model.SellRequest;
import com.mobilemart.model.SellRequestImage;
import com.mobilemart.model.ShopProfile;
import com.mobilemart.model.User;
import com.mobilemart.repository.BrandRepository;
import com.mobilemart.repository.EnquiryRepository;
import com.mobilemart.repository.ProductRepository;
import com.mobilemart.repository.ReservationRepository;
import com.mobilemart.repository.SearchHistoryRepository;
import com.mobilemart.repository.SellRequestRepository;
import com.mobilemart.repository.ShopProfileRepository;
import com.mobilemart.repository.UserRepository;
import com.mobilemart.security.Role;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShopProfileRepository shopProfileRepository;

    @Autowired
    private SellRequestRepository sellRequestRepository;

    @Autowired
    private EnquiryRepository enquiryRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initUsers();
        }
        if (brandRepository.count() == 0) {
            initBrands();
        }
        if (shopProfileRepository.count() == 0) {
            initShopProfile();
        }
        if (productRepository.count() == 0) {
            initProducts();
        }
        if (sellRequestRepository.count() == 0) {
            initSellRequests();
        }
        if (searchHistoryRepository.count() == 0) {
            initSearchHistory();
        }
    }

    private void initUsers() {
        String encodedPassword = passwordEncoder.encode("password123");

        User customer = new User("customer@example.com", encodedPassword, "John Customer", "+919876543211", Role.ROLE_CUSTOMER);
        User owner = new User("owner@example.com", encodedPassword, "Alex Shop Owner", "+919876543210", Role.ROLE_SHOP_OWNER);
        User admin = new User("admin@example.com", encodedPassword, "System Administrator", "+919876543299", Role.ROLE_ADMIN);

        userRepository.saveAll(Arrays.asList(customer, owner, admin));
    }

    private void initBrands() {
        List<Brand> brands = Arrays.asList(
                new Brand("Apple", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100"),
                new Brand("Samsung", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100"),
                new Brand("OnePlus", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100"),
                new Brand("Google", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100"),
                new Brand("Nothing", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100"),
                new Brand("Vivo", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100"),
                new Brand("Oppo", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100"),
                new Brand("Realme", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100")
        );
        brandRepository.saveAll(brands);
    }

    private void initShopProfile() {
        ShopProfile profile = new ShopProfile();
        profile.setName("MobileMart Certified Used Phones");
        profile.setLogoUrl("https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200");
        profile.setDescription("Your trusted destination for tested, certified, and warranty-backed pre-owned mobile phones. Every phone passes our 40-point quality check!");
        profile.setAddress("Shop #12, Tech Bazaar Main Road, Downtown City - 500001");
        profile.setPhone("+919876543210");
        profile.setWhatsappNumber("+919876543210");
        profile.setOpeningHours("Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM");
        profile.setGoogleMapUrl("https://maps.google.com");
        shopProfileRepository.save(profile);
    }

    private void initProducts() {
        // Create 32 realistic pre-owned phones
        Object[][] rawData = {
                // Brand, Model, Storage, RAM, Color, Condition, Battery, OriginalPrice, SellingPrice, WarrantyMonths, IsFeatured, IsDeal, DealOldPrice, DealNewPrice, ImgUrl
                {"Apple", "iPhone 15 Pro", "256GB", "8GB", "Natural Titanium", "EXCELLENT", "94%", 134900, 89999, 6, true, false, 0, 0, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"},
                {"Apple", "iPhone 14", "128GB", "6GB", "Blue", "EXCELLENT", "91%", 79900, 48999, 3, false, true, 51999, 48999, "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500"},
                {"Apple", "iPhone 13", "128GB", "4GB", "Midnight", "EXCELLENT", "89%", 69900, 34999, 3, true, false, 0, 0, "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500"},
                {"Apple", "iPhone 12", "128GB", "4GB", "Green", "VERY_GOOD", "85%", 59900, 26999, 3, false, false, 0, 0, "https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?w=500"},
                {"Apple", "iPhone 11", "64GB", "4GB", "Black", "GOOD", "82%", 49900, 18999, 1, false, false, 0, 0, "https://images.unsplash.com/photo-1574755393849-623942496936?w=500"},
                {"Apple", "iPhone SE 2022", "128GB", "4GB", "Starlight", "EXCELLENT", "90%", 43900, 21999, 3, false, false, 0, 0, "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"},

                {"Samsung", "Galaxy S23 Ultra", "256GB", "12GB", "Phantom Black", "EXCELLENT", "95%", 124999, 69999, 6, true, false, 0, 0, "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"},
                {"Samsung", "Galaxy S23", "128GB", "8GB", "Cream", "VERY_GOOD", "90%", 74999, 38999, 3, false, true, 41999, 38999, "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500"},
                {"Samsung", "Galaxy S22 5G", "128GB", "8GB", "Green", "VERY_GOOD", "87%", 72999, 29999, 3, false, false, 0, 0, "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Back_of_the_Samsung_Galaxy_S22.jpg/960px-Back_of_the_Samsung_Galaxy_S22.jpg"},
                {"Samsung", "Galaxy Z Flip 4", "256GB", "8GB", "Bora Purple", "GOOD", "88%", 89999, 35999, 3, false, false, 0, 0, "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500"},
                {"Samsung", "Galaxy A54 5G", "128GB", "8GB", "Awesome Lime", "EXCELLENT", "93%", 38999, 19999, 3, false, false, 0, 0, "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Samsung_Galaxy_A54_5G_2023.jpg/960px-Samsung_Galaxy_A54_5G_2023.jpg"},
                {"Samsung", "Galaxy Note 20 Ultra", "256GB", "12GB", "Mystic Bronze", "GOOD", "83%", 104999, 27999, 1, false, false, 0, 0, "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Samsung_Galaxy_Note_20_Ultra.png/960px-Samsung_Galaxy_Note_20_Ultra.png"},

                {"OnePlus", "OnePlus 11 5G", "256GB", "16GB", "Titan Black", "EXCELLENT", "92%", 61999, 36999, 3, false, true, 39999, 36999, "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500"},
                {"OnePlus", "OnePlus 10 Pro", "128GB", "8GB", "Emerald Forest", "VERY_GOOD", "89%", 66999, 28999, 3, false, false, 0, 0, "https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-10-pro-1.jpg"},
                {"OnePlus", "OnePlus Nord CE 3", "128GB", "8GB", "Aqua Surge", "EXCELLENT", "96%", 26999, 16499, 3, false, false, 0, 0, "https://i.gadgets360cdn.com/products/large/oneplus-nord-ce-3-659x800-1690863917.jpg?downsize=*:180"},
                {"OnePlus", "OnePlus 9 Pro", "256GB", "12GB", "Morning Mist", "GOOD", "84%", 64999, 22999, 1, false, false, 0, 0, "https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-9-pro-1.jpg"},

                {"Google", "Pixel 8 Pro", "128GB", "12GB", "Bay Blue", "EXCELLENT", "96%", 106999, 64999, 6, true, false, 0, 0, "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Google_Pixel_8_Pro_front.svg/960px-Google_Pixel_8_Pro_front.svg.png"},
                {"Google", "Pixel 7a", "128GB", "8GB", "Sea", "EXCELLENT", "93%", 43999, 24999, 3, false, false, 0, 0, "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Google_Pixel_7A.jpg/960px-Google_Pixel_7A.jpg"},
                {"Google", "Pixel 6a", "128GB", "6GB", "Chalk", "VERY_GOOD", "88%", 34999, 15999, 3, false, false, 0, 0, "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Google_Pixel_6a_back.jpg/960px-Google_Pixel_6a_back.jpg"},

                {"Nothing", "Nothing Phone (2)", "256GB", "12GB", "Dark Grey", "EXCELLENT", "94%", 49999, 31999, 3, false, true, 34999, 31999, "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Nothing_phone_%282%29_%28Booredatwork.com%29_001.png/960px-Nothing_phone_%282%29_%28Booredatwork.com%29_001.png"},
                {"Nothing", "Nothing Phone (1)", "128GB", "8GB", "White", "VERY_GOOD", "89%", 32999, 18999, 3, false, false, 0, 0, "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Nothing_Phone.jpg/960px-Nothing_Phone.jpg"},

                {"Vivo", "Vivo X90 Pro", "256GB", "12GB", "Legendary Black", "EXCELLENT", "92%", 84999, 44999, 3, false, false, 0, 0, "https://fdn2.gsmarena.com/vv/pics/vivo/vivo-x90-pro-1.jpg"},
                {"Vivo", "Vivo V27 Pro", "128GB", "8GB", "Magic Blue", "EXCELLENT", "91%", 37999, 21999, 3, false, false, 0, 0, "https://fdn2.gsmarena.com/vv/pics/vivo/vivo-v27-pro-1.jpg"},
                {"Vivo", "Vivo Y200 5G", "128GB", "8GB", "Jungle Green", "GOOD", "89%", 21999, 12999, 1, false, false, 0, 0, "https://fdn2.gsmarena.com/vv/pics/vivo/vivo-y200-1.jpg"},

                {"Oppo", "Oppo Find N2 Flip", "256GB", "8GB", "Astral Black", "EXCELLENT", "91%", 89999, 41999, 3, false, false, 0, 0, "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-n2-flip-1.jpg"},
                {"Oppo", "Oppo Reno 10 Pro", "256GB", "12GB", "Silvery Grey", "VERY_GOOD", "90%", 39999, 23999, 3, false, false, 0, 0, "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/OPPO_Reno_A_128GB.jpg/960px-OPPO_Reno_A_128GB.jpg"},

                {"Realme", "Realme GT 2 Pro", "128GB", "8GB", "Paper White", "EXCELLENT", "90%", 49999, 22999, 3, false, false, 0, 0, "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt2-pro-1.jpg"},
                {"Realme", "Realme 11 Pro+", "256GB", "12GB", "Oasis Green", "EXCELLENT", "95%", 29999, 17999, 3, false, false, 0, 0, "https://fdn2.gsmarena.com/vv/pics/realme/realme-11-pro-plus-1.jpg"}
        };

        for (int i = 0; i < rawData.length; i++) {
            Object[] row = rawData[i];
            Product p = new Product();
            p.setBrand((String) row[0]);
            p.setModelName((String) row[1]);
            p.setStorage((String) row[2]);
            p.setRam((String) row[3]);
            p.setColor((String) row[4]);
            p.setOverallCondition((String) row[5]);
            p.setBatteryHealth((String) row[6]);
            p.setOriginalPrice(new BigDecimal((Integer) row[7]));
            p.setSellingPrice(new BigDecimal((Integer) row[8]));

            p.setDisplayCondition("Clean, no deep scratches");
            p.setBodyCondition("Minor wear on frame");
            p.setCameraCondition("Tested 100% Working");
            p.setSpeakerCondition("Clear stereo sound");
            p.setChargingCondition("Fast Charging OK");
            p.setNetworkCondition("5G / Dual SIM OK");

            p.setBoxIncluded(true);
            p.setChargerIncluded(true);
            p.setCableIncluded(true);
            p.setBillIncluded(i % 2 == 0);

            int warrantyM = (Integer) row[9];
            p.setWarrantyAvailable(warrantyM > 0);
            p.setWarrantyMonths(warrantyM);
            if (warrantyM > 0) {
                p.setWarrantyType("Shop Warranty");
                p.setWarrantyStartDate(LocalDate.now());
                p.setWarrantyEndDate(LocalDate.now().plusMonths(warrantyM));
            }

            p.setIsFeatured((Boolean) row[10]);
            if (p.getIsFeatured()) {
                p.setFeaturedVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
            }

            p.setIsDeal((Boolean) row[11]);
            if (p.getIsDeal()) {
                p.setDealOldPrice(new BigDecimal((Integer) row[12]));
                p.setDealNewPrice(new BigDecimal((Integer) row[13]));
            }

            p.setStatus("AVAILABLE");
            p.setViewsCount(25 + (i * 7) % 150);
            p.setInternalStockId("MM-STK-" + (1000 + i));
            p.setImei1("8694030492" + (10000 + i));
            p.setPurchaseSource("Shop Trade-In");
            p.setPurchaseDate(LocalDate.now().minusDays(i * 3));

            // Set images
            String imgUrl = (String) row[14];
            p.addImage(new ProductImage(imgUrl, true));

            productRepository.save(p);
        }
    }

    private void initSellRequests() {
        User customer = userRepository.findByEmail("customer@example.com").orElse(null);
        if (customer == null) return;

        SellRequest req1 = new SellRequest();
        req1.setUser(customer);
        req1.setRequestNumber("SR-882101");
        req1.setBrand("Apple");
        req1.setModelName("iPhone 12 Mini");
        req1.setStorage("64GB");
        req1.setRam("4GB");
        req1.setColor("Blue");
        req1.setOverallCondition("VERY_GOOD");
        req1.setBatteryHealth("86%");
        req1.setDisplayCondition("Original display, no cracks");
        req1.setBodyCondition("Minor scuffs on edge");
        req1.setExpectedPrice(new BigDecimal("22000"));
        req1.setStatus("SUBMITTED");
        req1.addImage(new SellRequestImage("https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?w=500"));
        sellRequestRepository.save(req1);

        SellRequest req2 = new SellRequest();
        req2.setUser(customer);
        req2.setRequestNumber("SR-882102");
        req2.setBrand("Samsung");
        req2.setModelName("Galaxy S21 FE 5G");
        req2.setStorage("128GB");
        req2.setRam("8GB");
        req2.setColor("Lavender");
        req2.setOverallCondition("EXCELLENT");
        req2.setBatteryHealth("91%");
        req2.setDisplayCondition("Flawless screen with guard");
        req2.setExpectedPrice(new BigDecimal("18500"));
        req2.setOwnerOfferPrice(new BigDecimal("17000"));
        req2.setStatus("OFFER_MADE");
        req2.setOwnerNotes("We can offer ₹17,000 based on initial photos and current market value.");
        req2.addImage(new SellRequestImage("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"));
        sellRequestRepository.save(req2);
    }

    private void initSearchHistory() {
        searchHistoryRepository.save(new SearchHistory("iPhone 13", "Apple"));
        searchHistoryRepository.save(new SearchHistory("S23 Ultra", "Samsung"));
        searchHistoryRepository.save(new SearchHistory("OnePlus 11", "OnePlus"));
        searchHistoryRepository.save(new SearchHistory("Pixel 8", "Google"));
        searchHistoryRepository.save(new SearchHistory("5G Phones under 20k", null));
    }
}
