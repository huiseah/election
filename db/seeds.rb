Electorate.destroy_all
Party.destroy_all
State.destroy_all
User.destroy_all


u1 = User.create(:email => 'admin@admin.com', :password => 'a', :password_confirmation => 'a')
u1.is_admin = true
u1.save


s1 = State.create(:name => 'ACT', :size => 223697)
s2 = State.create(:name => 'NSW', :size => 4009318)
s3 = State.create(:name => 'NT', :size => 93883)
s4 = State.create(:name => 'QLD', :size => 2384179)
s5 = State.create(:name => 'SA', :size => 979949)
s6 = State.create(:name => 'TAS', :size => 327152)
s7 = State.create(:name => 'VIC', :size => 3180184)
s8 = State.create(:name => 'WA', :size => 1204001)

e1 = Electorate.create(:name => 'Blair', :sitting_mp => 'Shayne Kenneth NEUMANN', :state_id => s4.id)
e2 = Electorate.create(:name => 'Bonner', :sitting_mp => 'Ross Xavier VASTA', :state_id => s4.id)
e3 = Electorate.create(:name => 'Bowman', :sitting_mp => 'Andrew  LAMING', :state_id => s4.id)
e4 = Electorate.create(:name => 'Brisbane', :sitting_mp => 'Teresa  GAMBARO', :state_id => s4.id)
e5 = Electorate.create(:name => 'Capricornia', :sitting_mp => 'Kirsten LIVERMORE', :state_id => s4.id)
e6 = Electorate.create(:name => 'Dawson', :sitting_mp => 'George Robert CHRISTENSEN', :state_id => s4.id)
e7 = Electorate.create(:name => 'Dickson', :sitting_mp => 'Dickson  QLD 21357 Peter DUTTON', :state_id => s4.id)
e8 = Electorate.create(:name => 'Fadden', :sitting_mp => 'Stuart  ROBERT', :state_id => s4.id)
e9 = Electorate.create(:name => 'Fairfax', :sitting_mp => 'Alex  SOMLYAY', :state_id => s4.id)
e10 = Electorate.create(:name => 'Fisher', :sitting_mp => 'Peter SLIPPER', :state_id => s4.id)
e11 = Electorate.create(:name => 'Flynn', :sitting_mp => 'Ken O DOWD', :state_id => s4.id)
e12 = Electorate.create(:name => 'Forde', :sitting_mp => 'Bert  VAN MANEN', :state_id => s4.id)
e13 = Electorate.create(:name => 'Griffith', :sitting_mp => 'Kevin RUDD', :state_id => s4.id)
e14 = Electorate.create(:name => 'Groom', :sitting_mp => 'Ian MACFARLANE', :state_id => s4.id)
e15 = Electorate.create(:name => 'Herbert', :sitting_mp => 'Ewen  JONES', :state_id => s4.id)
e16 = Electorate.create(:name => 'Hinkler', :sitting_mp => 'Paul  NEVILLE', :state_id => s4.id)
e17 = Electorate.create(:name => 'Kennedy', :sitting_mp => 'Bob KATTER', :state_id => s4.id)
e18 = Electorate.create(:name => 'Leichhardt', :sitting_mp => 'Warren  ENTSCH', :state_id => s4.id)
e19 = Electorate.create(:name => 'Lilley', :sitting_mp => 'Wayne SWAN', :state_id => s4.id)
e20 = Electorate.create(:name => 'Longman', :sitting_mp => 'Wyatt ROY', :state_id => s4.id)
e21 = Electorate.create(:name => 'Maranoa', :sitting_mp => 'Bruce SCOTT', :state_id => s4.id)
e22 = Electorate.create(:name => 'McPherson', :sitting_mp => 'Karen ANDREWS', :state_id => s4.id)
e23 = Electorate.create(:name => 'Moncrieff', :sitting_mp => 'Steven  CIOBO', :state_id => s4.id)
e24 = Electorate.create(:name => 'Moreton', :sitting_mp => 'Graham  PERRETT', :state_id => s4.id)
e25 = Electorate.create(:name => 'Oxley', :sitting_mp => 'Bernie  RIPOLL', :state_id => s4.id)
e26 = Electorate.create(:name => 'Petrie', :sitting_mp => 'Yvette  D ATH', :state_id => s4.id)
e27 = Electorate.create(:name => 'Rankin', :sitting_mp => 'Craig EMERSON', :state_id => s4.id)
e28 = Electorate.create(:name => 'Ryan', :sitting_mp => 'Jane  PRENTICE', :state_id => s4.id)
e29 = Electorate.create(:name => 'Wide Bay', :sitting_mp => 'Warren  TRUSS', :state_id => s4.id)
e30 = Electorate.create(:name => 'Wright', :sitting_mp => 'Scott BUCHHOLZ', :state_id => s4.id)
e31 = Electorate.create(:name => 'ACT', :sitting_mp => 'Labor', :state_id => s1.id)
e32 = Electorate.create(:name => 'NSW', :sitting_mp => 'Coalition', :state_id => s2.id)
e33 = Electorate.create(:name => 'NT', :sitting_mp => 'Labor', :state_id => s3.id)
e34 = Electorate.create(:name => 'SA', :sitting_mp => 'Labor', :state_id => s5.id)
e35 = Electorate.create(:name => 'TAS', :sitting_mp => 'Labor', :state_id => s6.id)
e36 = Electorate.create(:name => 'VIC', :sitting_mp => 'Labor', :state_id => s7.id)
e37 = Electorate.create(:name => 'WA', :sitting_mp => 'Coalition', :state_id => s8.id)




p1 = Party.create(:name => 'ALP', :electorate_id => e1.id, :candidate => e1.sitting_mp, :poll => 54.24 )
p2 = Party.create(:name => 'LNQ', :electorate_id => e1.id, :candidate => 'Neil Leslie ZABEL', :poll => 45.76)

p3 = Party.create(:name => 'ALP', :electorate_id => e2.id, :candidate => 'Kerry REA', :poll => 47.18)
p4 = Party.create(:name => 'LNQ', :electorate_id => e2.id, :candidate => e2.sitting_mp, :poll => 52.82)

p5 = Party.create(:name => 'ALP', :electorate_id => e3.id, :candidate => 'Jenny PETERS', :poll => 39.61)
p6 = Party.create(:name => 'LNQ', :electorate_id => e3.id, :candidate => e3.sitting_mp, :poll => 60.39)

p7 = Party.create(:name => 'ALP', :electorate_id => e4.id, :candidate => 'Arch BEVIS', :poll => 48.87)
p8 = Party.create(:name => 'LNQ', :electorate_id => e4.id, :candidate => e4.sitting_mp, :poll => 51.13)

p9 = Party.create(:name => 'ALP', :electorate_id => e5.id, :candidate => e5.sitting_mp, :poll => 53.68)
p10 = Party.create(:name => 'LNQ', :electorate_id => e5.id, :candidate => 'Michelle LANDRY', :poll => 46.32)

p11 = Party.create(:name => 'ALP', :electorate_id => e6.id, :candidate => 'Mike BRUNKER', :poll => 47.57)
p12 = Party.create(:name => 'LNQ', :electorate_id => e6.id, :candidate => e6.sitting_mp, :poll => 52.43)

p13 = Party.create(:name => 'ALP', :electorate_id => e7.id, :candidate => 'Fiona McNAMARA', :poll => 44.87)
p14 = Party.create(:name => 'LNQ', :electorate_id => e7.id, :candidate => e7.sitting_mp, :poll => 55.13)

p15 = Party.create(:name => 'ALP', :electorate_id => e8.id, :candidate => 'Rana WATSON', :poll => 35.81)
p16 = Party.create(:name => 'LNQ', :electorate_id => e8.id, :candidate => e8.sitting_mp, :poll => 64.19)

p17 = Party.create(:name => 'ALP', :electorate_id => e9.id, :candidate => 'Dan McINTYRE', :poll => 43.05)
p18 = Party.create(:name => 'LNQ', :electorate_id => e9.id, :candidate => e9.sitting_mp, :poll => 56.95)

p19 = Party.create(:name => 'ALP', :electorate_id => e10.id, :candidate => 'Chris CUMMINS', :poll => 45.87)
p20 = Party.create(:name => 'INDY', :electorate_id => e10.id, :candidate => e10.sitting_mp, :poll => 54.13)

p21 = Party.create(:name => 'ALP', :electorate_id => e11.id, :candidate => 'Chris TREVOR', :poll => 46.42)
p22 = Party.create(:name => 'LNQ', :electorate_id => e11.id, :candidate => e11.sitting_mp, :poll => 53.58)

p23 = Party.create(:name => 'ALP', :electorate_id => e12.id, :candidate => 'Brett RAGUSE', :poll => 48.37)
p24 = Party.create(:name => 'LNQ', :electorate_id => e12.id, :candidate => e12.sitting_mp, :poll => 51.63)

p25 = Party.create(:name => 'ALP', :electorate_id => e13.id, :candidate => e13.sitting_mp, :poll => 58.46)
p26 = Party.create(:name => 'LNQ', :electorate_id => e13.id, :candidate => 'Rebecca DOCHERTY', :poll => 41.54)

p27 = Party.create(:name => 'ALP', :electorate_id => e14.id, :candidate => 'Chris MEIBUSCH', :poll => 31.47)
p28 = Party.create(:name => 'LNQ', :electorate_id => e14.id, :candidate => e14.sitting_mp, :poll => 68.53)

p29 = Party.create(:name => 'ALP', :electorate_id => e15.id, :candidate => 'Tony MOONEY', :poll => 47.83)
p30 = Party.create(:name => 'LNQ', :electorate_id => e15.id, :candidate => e15.sitting_mp, :poll => 52.17)

p31 = Party.create(:name => 'ALP', :electorate_id => e16.id, :candidate => 'Belinda MCNEVEN', :poll => 39.61)
p32 = Party.create(:name => 'LNQ', :electorate_id => e16.id, :candidate => e16.sitting_mp, :poll => 60.39)

p33 = Party.create(:name => 'LNQ', :electorate_id => e17.id, :candidate => 'Ed MORRISON', :poll => 31.66)
p34 = Party.create(:name => 'INDY', :electorate_id => e17.id, :candidate => e17.sitting_mp, :poll => 68.34)

p35 = Party.create(:name => 'ALP', :electorate_id => e18.id, :candidate => 'Jim TURNOUR', :poll => 45.45)
p36 = Party.create(:name => 'LNQ', :electorate_id => e18.id, :candidate => e18.sitting_mp, :poll => 54.55)

p37 = Party.create(:name => 'ALP', :electorate_id => e19.id, :candidate => e19.sitting_mp, :poll => 53.18)
p38 = Party.create(:name => 'LNQ', :electorate_id => e19.id, :candidate => 'Rod McGARVIE', :poll => 46.82)

p39 = Party.create(:name => 'ALP', :electorate_id => e20.id, :candidate => 'Jon SULLIVAN', :poll => 48.08)
p40 = Party.create(:name => 'LNQ', :electorate_id => e20.id, :candidate => e20.sitting_mp, :poll => 51.92)

p41 = Party.create(:name => 'ALP', :electorate_id => e21.id, :candidate => 'Geoff KEATING', :poll => 27.11)
p42 = Party.create(:name => 'LNQ', :electorate_id => e21.id, :candidate => e21.sitting_mp, :poll => 72.89)

p43 = Party.create(:name => 'ALP', :electorate_id => e22.id, :candidate => 'Dan BYRON', :poll => 39.72)
p44 = Party.create(:name => 'LNQ', :electorate_id => e22.id, :candidate => e22.sitting_mp, :poll => 60.28)

p45 = Party.create(:name => 'ALP', :electorate_id => e23.id, :candidate => 'Robert HOUGH', :poll => 32.51)
p46 = Party.create(:name => 'LNQ', :electorate_id => e23.id, :candidate => e23.sitting_mp, :poll => 67.49)

p47 = Party.create(:name => 'ALP', :electorate_id => e24.id, :candidate => e24.sitting_mp, :poll => 51.13)
p48 = Party.create(:name => 'LNQ', :electorate_id => e24.id, :candidate => 'Malcolm Edward COLE', :poll => 48.87)

p49 = Party.create(:name => 'ALP', :electorate_id => e25.id, :candidate => e25.sitting_mp, :poll => 55.77)
p50 = Party.create(:name => 'LNQ', :electorate_id => e25.id, :candidate => 'Tarnya Lisa SMITH', :poll => 44.23)

p51 = Party.create(:name => 'ALP', :electorate_id => e26.id, :candidate => e26.sitting_mp, :poll => 52.51)
p52 = Party.create(:name => 'LNQ', :electorate_id => e26.id, :candidate => 'Dean TEASDALE', :poll => 47.49)

p53 = Party.create(:name => 'ALP', :electorate_id => e27.id, :candidate => e27.sitting_mp, :poll => 55.41)
p54 = Party.create(:name => 'LNQ', :electorate_id => e27.id, :candidate => 'Luke SMITH', :poll => 44.59)

p55 = Party.create(:name => 'ALP', :electorate_id => e28.id, :candidate => 'Steven MILES', :poll => 42.84)
p56 = Party.create(:name => 'LNQ', :electorate_id => e28.id, :candidate => e28.sitting_mp, :poll => 57.16)

p57 = Party.create(:name => 'ALP', :electorate_id => e29.id, :candidate => 'Nikolee ANSELL', :poll => 34.39)
p58 = Party.create(:name => 'LNQ', :electorate_id => e29.id, :candidate => e29.sitting_mp, :poll => 65.61)

p59 = Party.create(:name => 'ALP', :electorate_id => e30.id, :candidate => 'Andrew RAMSAY', :poll => 39.85)
p60 = Party.create(:name => 'LNQ', :electorate_id => e30.id, :candidate => e30.sitting_mp, :poll => 60.15)

p61 = Party.create(:name => 'ALP', :electorate_id => e31.id, :candidate => e31.sitting_mp, :poll => 61.67)
p62 = Party.create(:name => 'COAL', :electorate_id => e31.id, :candidate => 'Coalition', :poll => 38.33)

p63 = Party.create(:name => 'ALP', :electorate_id => e32.id, :candidate => 'Labor', :poll => 48.84)
p64 = Party.create(:name => 'COAL', :electorate_id => e32.id, :candidate => e32.sitting_mp, :poll => 51.16)

p65 = Party.create(:name => 'ALP', :electorate_id => e33.id, :candidate => e33.sitting_mp, :poll => 50.74)
p66 = Party.create(:name => 'COAL', :electorate_id => e33.id, :candidate => 'Coalition', :poll => 49.26)

p67 = Party.create(:name => 'ALP', :electorate_id => e34.id, :candidate => e34.sitting_mp, :poll => 53.18)
p68 = Party.create(:name => 'COAL', :electorate_id => e34.id, :candidate => 'Coalition', :poll => 46.82)

p69 = Party.create(:name => 'ALP', :electorate_id => e35.id, :candidate => e35.sitting_mp, :poll => 60.62)
p70 = Party.create(:name => 'COAL', :electorate_id => e35.id, :candidate => 'Coalition', :poll => 39.38)

p71 = Party.create(:name => 'ALP', :electorate_id => e36.id, :candidate => e36.sitting_mp, :poll => 55.31)
p72 = Party.create(:name => 'COAL', :electorate_id => e36.id, :candidate => 'Coalition', :poll => 44.69)

p73 = Party.create(:name => 'ALP', :electorate_id => e37.id, :candidate => 'Labor', :poll => 43.59)
p74 = Party.create(:name => 'COAL', :electorate_id => e37.id, :candidate => e37.sitting_mp, :poll => 56.41)
