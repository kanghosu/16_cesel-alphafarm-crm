var WebLeadDb = (function () {
  var WEB_SHEET = "12_웹크롤링DB";
  var TARGET_SHEET = "08_타깃리스트";

  var WEB_HEADERS = [
    "수집ID",
    "접촉단계",
    "고객DB승격근거",
    "고객DB승격가능",
    "타깃리스트반영",
    "A/B/C 등급",
    "거래준비도 점수",
    "다음액션",
    "업체명",
    "제품군",
    "고객유형",
    "지역",
    "공식 전화번호",
    "공식 이메일",
    "담당자",
    "권장 연락방법",
    "메일 제목",
    "메일 초안",
    "제안 현황",
    "마지막 제안일",
    "다음 연락일",
    "후속 연락 메모",
    "연락채널 메모",
    "첫 접촉 포인트",
    "추정 니즈",
    "시설/자산 단서",
    "예산/투자 단서",
    "의사결정자 단서",
    "공개 출처",
    "출처 신뢰도",
    "웹출처URL",
    "수집일",
    "수집채널",
    "검색쿼리",
    "제품군 확신도",
    "점수 사유",
    "승격차단사유",
    "크롤링메모"
  ];

  var TARGET_HEADERS = [
    "타깃ID",
    "업체명",
    "고객유형",
    "지역",
    "우선제품",
    "담당자",
    "연락처",
    "이메일",
    "출처",
    "우선순위",
    "접촉예정일",
    "접촉상태",
    "메모",
    "시설/자산 단서",
    "예산/투자 단서",
    "의사결정자 단서",
    "탈락질문 결과",
    "거래준비도 점수",
    "점수 사유",
    "A/B/C 등급",
    "접촉단계",
    "고객DB승격근거",
    "고객DB승격가능",
    "승격차단사유",
    "승격사유"
  ];

  var SEOUL_GYEONGGI_DEMAND_ROWS = [
    {
      gradeHint: "A",
      product: "AlphaCafe",
      company: "AK플라자 분당 / 상품본부",
      region: "성남 분당 서현",
      type: "백화점 상품본부·F&B",
      contact: "1661-1114 / 공식 제안·고객지원 채널",
      phone: "1661-1114",
      email: "hk-kang@aekyung.kr",
      manager: "강호경 F&B팀장",
      contactMemo: "AK 상품본부 F&B팀. 팝업/델리/베이커리&디저트 담당: 조연영 yeonyoung2@aekyung.kr, 이재영 leey.11@aekyung.kr, 김선진 clive420@aekyung.kr. NSC 테넌트 카페/베이커리/레스토랑: 임성수 lss0906@aekyung.kr. 푸드홀/팝업: 김경아 kyungah@aekyung.kr, 한정길 rightway@aekyung.kr.",
      source: "공식 홈페이지 / 리서치 브리프",
      asset: "백화점, 상품본부, 푸드홀, F&B팀",
      budget: "시즌 디저트, 팝업, 신규 F&B 검토 가능성",
      decision: "F&B/푸드홀 담당 부서 연결 필요",
      needs: "푸드홀 신규 디저트, 여름철 딸기 수급, 팝업 검토",
      point: "분당권 푸드홀에서 프리미엄 딸기 디저트 제안"
    },
    {
      gradeHint: "A",
      product: "Alpha Experience Portfolio",
      company: "현대백화점 판교점",
      region: "성남 판교",
      type: "백화점·프리미엄 리테일 공간",
      contact: "1588-3650 / 고객상담실 공식 채널",
      source: "공식 홈페이지 / 공식 블로그 / 리서치 브리프",
      asset: "백화점, 라운지, 문화홀, 디저트 팝업 공간",
      budget: "팝업, 공간 차별화, 프리미엄 F&B 기획",
      decision: "고객상담실 경유 식품·공간 제휴 담당 연결 필요",
      needs: "라이브 설치형 팝업, 고객 체류시간, SNS 확산",
      point: "공간 차별화형 팝업/라이브 설치 제안"
    },
    {
      gradeHint: "A",
      product: "Alpha Experience Portfolio",
      company: "GRAVITY JOSUN 서울 판교",
      region: "성남 판교",
      type: "호텔·라이프스타일 호텔",
      contact: "031-539-4800 / 공식 예약·문의 채널",
      source: "공식 홈페이지 / 리서치 브리프",
      asset: "호텔, 레스토랑·바, 미팅 스페이스, 판교역 인접",
      budget: "프리미엄 호텔 공간 차별화 검토 가능성",
      decision: "세일즈 또는 식음 담당자 연결 필요",
      needs: "공용부·레스토랑 인접 공간 차별화, 체험 요소",
      point: "판교 고객에게 보이는 라이브 설치형 딸기 경험 제안"
    },
    {
      gradeHint: "A",
      product: "Alpha Experience Portfolio",
      company: "더블트리 바이 힐튼 서울 판교",
      region: "성남 판교",
      type: "호텔·MICE",
      contact: "공식 대표 채널 확인 필요",
      source: "공식 홈페이지 / 리서치 브리프",
      asset: "호텔, 베이커리 카페, 루프톱 레스토랑, MICE 시설",
      budget: "기업행사·시즌 F&B 차별화 가능성",
      decision: "행사 또는 식음 관련 담당자 연결 필요",
      needs: "로비/라운지 체험형 설치, 기업행사용 스토리텔링",
      point: "공간 차별화와 프리미엄 딸기 경험 제안"
    },
    {
      gradeHint: "A",
      product: "AlphaCafe",
      company: "코트야드 메리어트 서울 판교 MoMo Cafe",
      region: "성남 판교",
      type: "호텔 레스토랑·이벤트",
      contact: "031-8060-2150 / 공식 이벤트 채널",
      source: "공식 홈페이지 / 리서치 브리프",
      asset: "호텔 F&B, 뷔페/바, 이벤트 채널",
      budget: "호텔 디저트/브런치 시즌 파일럿 가능성",
      decision: "MoMo Cafe 또는 이벤트 담당 연결 필요",
      needs: "여름철 딸기 수급 대안, 호텔 디저트 파일럿",
      point: "베이커리·뷔페용 프리미엄 죽향 파일럿 검증"
    },
    {
      gradeHint: "A",
      product: "Alpha Experience Portfolio",
      company: "호텔 스카이파크 센트럴 서울 판교",
      region: "성남 판교",
      type: "호텔·연회",
      contact: "031-5170-7750 / 공식 연회·예약 채널",
      source: "공식 홈페이지 / 리서치 브리프",
      asset: "호텔, 연회장, 판교 비즈니스 수요",
      budget: "기업행사·세미나 공간 차별화 가능성",
      decision: "연회 또는 세일즈 담당자 연결 필요",
      needs: "연회장 앞 포토제닉 설치물, 기업행사 체험 요소",
      point: "기업행사·세미나 공간에 적용 가능한 라이브 딸기 설치"
    },
    {
      gradeHint: "A",
      product: "AlphaCafe",
      company: "갤러리아 광교",
      region: "수원 광교",
      type: "프리미엄 백화점",
      contact: "031-5174-6228 / 공식 CS·바이어 연결 채널",
      source: "공식 홈페이지 / 리서치 브리프",
      asset: "프리미엄 백화점, B1 DELI & DESSERT",
      budget: "프리미엄 딸기 판매, 디저트 협업, 라이브 쇼케이스",
      decision: "델리·농산 담당 바이어 연결 필요",
      needs: "식품관/팝업 공간 연계 제안",
      point: "프리미엄 딸기 판매+디저트 협업"
    },
    {
      gradeHint: "A",
      product: "AlphaFarm Core",
      company: "오아시스",
      region: "성남 중원",
      type: "친환경 신선식품 유통사",
      contact: "1577-0098 / 공식 대표메일·입점상담 채널",
      source: "공식 홈페이지 / 리서치 브리프",
      asset: "성남본사, 법인, 신선식품 유통",
      budget: "계약재배·직거래·프리미엄 신선식품 검토",
      decision: "신선식품/제휴 담당 연결 필요",
      needs: "안정공급, 브랜드 차별화, 프리미엄 딸기 SKU",
      point: "실내 안정생산형 프리미엄 죽향 제안"
    },
    {
      gradeHint: "A",
      product: "40ft HC ContainerFarm",
      company: "성남시농업기술센터",
      region: "성남",
      type: "농업기술센터·실증기관",
      contact: "031-729-4326 / 공식 센터 채널",
      source: "공식 센터 안내 / 리서치 브리프",
      asset: "공공 농업기관, 교육·실증 성격",
      budget: "파일럿, 교육용, 도심형 실증",
      decision: "도시농업·스마트농업 담당 연결 필요",
      needs: "죽향 딸기 컨테이너형 파일럿 실증",
      point: "스마트농업 실증 담당자 확인"
    },
    {
      gradeHint: "A",
      product: "40ft HC ContainerFarm",
      company: "용인시농업기술센터",
      region: "용인",
      type: "농업기술센터·교육기관",
      contact: "031-6193-1001 / 원예기술팀 공식 채널",
      source: "용인시 공식 조직도 / 리서치 브리프",
      asset: "스마트농업 테스트베드 교육장, 원예기술팀",
      budget: "교육·시범사업·재배기술 검증형 파일럿",
      decision: "원예기술팀 또는 스마트농업 담당 연결 필요",
      needs: "저온·저습·공조형 테스트베드 검토",
      point: "죽향 특화 테스트베드 검토"
    },
    {
      gradeHint: "B",
      product: "40ft HC ContainerFarm",
      company: "수원시농업기술센터",
      region: "수원",
      type: "농업기술센터·도시농업 교육기관",
      contact: "031-228-2571 / 수원시 공식 채널",
      source: "수원시 공식 보도자료 / 리서치 브리프",
      asset: "도시농업·교육 프로그램, 공공 교육기관",
      budget: "시민교육형 실증, 체험+기술검증 모델",
      decision: "도시농업 담당자 연결 필요",
      needs: "소형 파일럿 설치 후 교육·체험 연계",
      point: "도시농업 교육형 스마트팜 파일럿 제안"
    },
    {
      gradeHint: "B",
      product: "40ft HC ContainerFarm",
      company: "경기도농업기술원",
      region: "화성·경기권",
      type: "연구기관·실증기관",
      contact: "031-8008-9325 / 미래농업팀 공식 채널",
      source: "공식 조직·업무 안내 / 리서치 브리프",
      asset: "스마트팜 기술 개발, 식물공장, 데이터 활용 연구",
      budget: "죽향 품종 검증, 기술 검토, 공공 실증 파트너십",
      decision: "미래농업팀 또는 연구 담당 연결 필요",
      needs: "죽향 전용 환경제어·재배랙·운영기술 결합 검증",
      point: "공공 실증·연구 협력 가능성 확인"
    },
    {
      gradeHint: "B",
      product: "40ft HC ContainerFarm",
      company: "경기도농수산진흥원 스마트팜 지원센터",
      region: "광주·경기권",
      type: "스마트팜 교육·컨설팅 기관",
      contact: "031-250-2700 / 공식 대표 채널",
      source: "공식 스마트팜 지원센터 안내 / 리서치 브리프",
      asset: "스마트팜 교육, 컨설팅, 시설농가 모니터링",
      budget: "교육기관 대상 납품·실증, 장비 보강·파일럿 설치",
      decision: "현장지원센터 담당 연결 필요",
      needs: "기존 스마트팜 지원업무에 딸기 특화 실증 모델 추가",
      point: "스마트팜 교육·컨설팅 연계 제안"
    },
    {
      gradeHint: "B",
      product: "AlphaCafe",
      company: "아티제",
      region: "서울 강남",
      type: "프리미엄 디저트 카페 본사",
      contact: "02-2155-5777 / VOC 공식 채널",
      source: "공식 홈페이지 / 공식 인스타 / 리서치 브리프",
      asset: "본사, 디저트·케이크 운영, 프리미엄 카페 브랜드",
      budget: "여름 딸기 케이크 유지, 시즌 한정판",
      decision: "상품/브랜드 담당 연결 필요",
      needs: "여름철에도 딸기 SKU를 잃지 않는 공급/파일럿",
      point: "프리미엄 딸기 공급 파일럿 제안"
    },
    {
      gradeHint: "B",
      product: "AlphaCafe",
      company: "투썸플레이스",
      region: "서울 중구",
      type: "프리미엄 디저트 카페 본사",
      contact: "1577-4410 / 공식 고객센터·기업 채널",
      source: "공식 홈페이지 / 리서치 브리프",
      asset: "본사, 프리미엄 디저트 카페, 딸기 케이크 대표 상품",
      budget: "연중 프리미엄 딸기 케이크, 파일럿 점포 검증",
      decision: "상품/신사업 또는 브랜드 담당 연결 필요",
      needs: "여름철 딸기 수급 어려움 해결용 프리미엄 파일럿",
      point: "대표 딸기 케이크 안정 수급 제안"
    },
    {
      gradeHint: "B",
      product: "AlphaCafe",
      company: "조선 팰리스 / 조선델리 더 부티크",
      region: "서울 강남",
      type: "럭셔리 호텔 베이커리",
      contact: "02-727-7650 / 기업연회 공식 채널",
      source: "공식 델리·미팅 페이지 / 리서치 브리프",
      asset: "럭셔리 호텔, 조선델리, 기업연회 채널",
      budget: "고급 딸기 디저트 시즌 연장, VIP 수요 대응",
      decision: "조선델리 또는 기업연회 담당 연결 필요",
      needs: "고급 딸기 케이크를 여름까지 안정적으로 이어가는 제안",
      point: "럭셔리 딸기 디저트 안정생산 제안"
    },
    {
      gradeHint: "B",
      product: "AlphaFarm Core",
      company: "CJ프레시웨이",
      region: "서울 마포",
      type: "식자재 유통·푸드서비스 기업",
      contact: "02-2149-6114 / 공식 납품상담 채널",
      source: "공식 홈페이지 / 리서치 브리프",
      asset: "본사, 식자재 유통, 전국 유통 인프라",
      budget: "신상품 납품 상담, 프리미엄 B2B 유통",
      decision: "식자재 구매/신상품 납품 담당 연결 필요",
      needs: "프리미엄 딸기 B2B 유통, 호텔/카페 고객사 연계",
      point: "죽향 안정생산 기반 프리미엄 식자재 제안"
    },
    {
      gradeHint: "B",
      product: "AlphaFarm Core",
      company: "신세계푸드",
      region: "서울 성동",
      type: "종합식품·유통·베이커리 기업",
      contact: "02-3397-6000 / 공식 구매상담 채널",
      source: "공식 Contact Us / Biz Infra / 리서치 브리프",
      asset: "본사, 조달·R&D·가공·보관·물류·영업 인프라",
      budget: "프리미엄 딸기 원료·베이커리·급식·외식 채널 검토",
      decision: "식자재 구매상담 또는 협력회사 담당 연결 필요",
      needs: "죽향 딸기의 안정생산과 고부가 상품화 연결",
      point: "고부가 딸기 상품화 제안"
    },
    {
      gradeHint: "B",
      product: "ASEAN Service",
      company: "SPC삼립 / 파리바게뜨",
      region: "경기 시흥·서울권",
      type: "베이커리·글로벌 식품기업",
      contact: "080-739-8572 / 공식 비즈니스 문의 채널",
      source: "공식 홈페이지 / 리서치 브리프",
      asset: "글로벌 베이커리 브랜드, 해외 사업 축",
      budget: "ASEAN 검증, 현지 테스트베드, 저온·제습·안정수급",
      decision: "글로벌/비즈니스 문의 담당 연결 필요",
      needs: "동남아 베이커리용 딸기 공급 구조를 현지 검증부터 잡는 제안",
      point: "ASEAN 현지 검증·사업화 서비스 제안"
    },
    {
      gradeHint: "C",
      product: "ASEAN Service",
      company: "CJ푸드빌",
      region: "서울 중구",
      type: "외식·글로벌 프랜차이즈 기업",
      contact: "1577-0700 / 공식 Contact Us",
      source: "공식 Contact Us / International Franchising / 리서치 브리프",
      asset: "외식·글로벌 프랜차이즈, 국가별 연락 채널",
      budget: "ASEAN 진출 사전 검증, 베이커리·카페 채널 사업화",
      decision: "글로벌/국제 프랜차이즈 담당 연결 필요",
      needs: "싱가포르·말레이시아·인도네시아 진출 전 검증형 딸기 사업",
      point: "동남아 진출 전 현지 실증·파트너 검증 제안"
    }
  ];

  function setupWebLeadDb() {
    var sheet = getOrCreateSheet_(CrmConfig.getSpreadsheet(), WEB_SHEET);
    rebuildSheetByHeaderOrder_(sheet, WEB_HEADERS);
    enrichKnownContactDetails_(sheet);
    enrichMailingFields_(sheet);
    applyWebLeadDbView();
    return WEB_SHEET + " setup complete";
  }

  function applyWebLeadDbView() {
    var sheet = getOrCreateSheet_(CrmConfig.getSpreadsheet(), WEB_SHEET);
    rebuildSheetByHeaderOrder_(sheet, WEB_HEADERS);
    enrichKnownContactDetails_(sheet);
    enrichMailingFields_(sheet);
    applySheetFormat_(sheet);
    return WEB_SHEET + " view improved";
  }

  function scoreWebLeadDb() {
    var ss = CrmConfig.getSpreadsheet();
    var sheet = getOrCreateSheet_(ss, WEB_SHEET);
    rebuildSheetByHeaderOrder_(sheet, WEB_HEADERS);
    enrichKnownContactDetails_(sheet);
    enrichMailingFields_(sheet);

    var values = sheet.getDataRange().getValues();
    if (values.length < 2) {
      applySheetFormat_(sheet);
      return 0;
    }

    var headerMap = getHeaderMap_(values[0]);
    var count = 0;
    for (var rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
      var row = values[rowIndex];
      if (!getCell_(row, headerMap, "업체명")) continue;

      var rowNumber = rowIndex + 1;
      normalizeProcessFields_(sheet, rowNumber, row, headerMap);

      var refreshedRow = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];
      var result = LeadQuality.scoreLead(rowToLead_(refreshedRow, headerMap));
      var gate = CustomerDbGate.evaluate(rowToPromotionLead_(refreshedRow, headerMap, result.grade));

      writeByHeader_(sheet, rowNumber, "거래준비도 점수", result.readinessScore);
      writeByHeader_(sheet, rowNumber, "제품군 확신도", result.productConfidence);
      writeByHeader_(sheet, rowNumber, "A/B/C 등급", result.grade);
      writeByHeader_(sheet, rowNumber, "점수 사유", result.scoreReason);
      writeByHeader_(sheet, rowNumber, "고객DB승격가능", gate.allowed);
      writeByHeader_(sheet, rowNumber, "승격차단사유", gate.blockReason);
      if (!getCell_(refreshedRow, headerMap, "다음액션")) {
        writeByHeader_(sheet, rowNumber, "다음액션", "공식 채널 확인 후 전화/메일 후보로 선별");
      }
      count += 1;
    }
    applySheetFormat_(sheet);
    return count;
  }

  function seedResearchBriefWebLeads() {
    return seedSeoulGyeonggiDemandLeads();
  }

  function seedSeoulGyeonggiDemandLeads() {
    setupWebLeadDb();
    var sheet = CrmConfig.getSpreadsheet().getSheetByName(WEB_SHEET);
    var values = sheet.getDataRange().getValues();
    var headerMap = getHeaderMap_(values[0]);
    var existing = {};
    for (var i = 1; i < values.length; i += 1) {
      var name = getCell_(values[i], headerMap, "업체명");
      if (name) existing[normalizeKey_(name)] = true;
    }

    var added = 0;
    SEOUL_GYEONGGI_DEMAND_ROWS.forEach(function (item) {
      if (existing[normalizeKey_(item.company)]) return;
      var row = new Array(values[0].length).fill("");
      setCell_(row, headerMap, "수집ID", nextWebLeadId_(sheet));
      setCell_(row, headerMap, "접촉단계", "미접촉");
      setCell_(row, headerMap, "고객DB승격근거", "없음");
      setCell_(row, headerMap, "고객DB승격가능", "N");
      setCell_(row, headerMap, "타깃리스트반영", item.gradeHint === "A" ? "Y" : "");
      setCell_(row, headerMap, "A/B/C 등급", item.gradeHint);
      setCell_(row, headerMap, "다음액션", item.gradeHint === "A" ? "오늘 전화/메일 1순위 후보" : "공식 채널 보강 후 접촉");
      setCell_(row, headerMap, "업체명", item.company);
      setCell_(row, headerMap, "제품군", item.product);
      setCell_(row, headerMap, "고객유형", item.type);
      setCell_(row, headerMap, "지역", item.region);
      setCell_(row, headerMap, "공식 전화번호", item.phone || extractPhones_(item.contact).join(" / "));
      setCell_(row, headerMap, "공식 이메일", item.email || firstValue_(extractEmails_(item.contact)));
      setCell_(row, headerMap, "연락채널 메모", item.contactMemo || extractContactMemo_(item.contact));
      setCell_(row, headerMap, "담당자", item.manager || "");
      setCell_(row, headerMap, "권장 연락방법", buildRecommendedContactMethod_(item));
      setCell_(row, headerMap, "메일 제목", buildEmailSubject_(item));
      setCell_(row, headerMap, "메일 초안", buildEmailDraft_(item));
      setCell_(row, headerMap, "제안 현황", "메일초안작성");
      setCell_(row, headerMap, "후속 연락 메모", "대표 컨펌 후 공식 이메일/문의 채널로 접수. 발송 후 제안 현황과 마지막 제안일 업데이트.");
      setCell_(row, headerMap, "첫 접촉 포인트", item.point);
      setCell_(row, headerMap, "추정 니즈", item.needs);
      setCell_(row, headerMap, "시설/자산 단서", item.asset);
      setCell_(row, headerMap, "예산/투자 단서", item.budget);
      setCell_(row, headerMap, "의사결정자 단서", item.decision);
      setCell_(row, headerMap, "공개 출처", item.source);
      setCell_(row, headerMap, "출처 신뢰도", "공식/리서치 확인");
      setCell_(row, headerMap, "수집일", new Date());
      setCell_(row, headerMap, "수집채널", "서울경기수요리서치");
      setCell_(row, headerMap, "검색쿼리", "deep-research-report (7)/(8)");
      setCell_(row, headerMap, "크롤링메모", "서울·경기권 예상 수요 후보. 회신/오프라인/연락처 확보 전 고객DB 직접 입력 금지.");
      sheet.appendRow(row);
      existing[normalizeKey_(item.company)] = true;
      added += 1;
    });
    scoreWebLeadDb();
    return added;
  }

  function promoteSelectedWebLeadsToTargetList() {
    LeadQualityRunner.setupLeadQualityCrm();
    setupWebLeadDb();

    var ss = CrmConfig.getSpreadsheet();
    var web = ss.getSheetByName(WEB_SHEET);
    var target = getOrCreateSheet_(ss, TARGET_SHEET);
    ensureHeaders_(target, TARGET_HEADERS);

    var webValues = web.getDataRange().getValues();
    if (webValues.length < 2) return 0;
    var webMap = getHeaderMap_(webValues[0]);
    var targetValues = target.getDataRange().getValues();
    var targetMap = getHeaderMap_(targetValues[0]);
    var existing = {};
    for (var i = 1; i < targetValues.length; i += 1) {
      var existingName = getCell_(targetValues[i], targetMap, "업체명");
      if (existingName) existing[normalizeKey_(existingName)] = true;
    }

    var moved = 0;
    for (var rowIndex = 1; rowIndex < webValues.length; rowIndex += 1) {
      var webRow = webValues[rowIndex];
      var marker = normalizeText_(getCell_(webRow, webMap, "타깃리스트반영"));
      var company = getCell_(webRow, webMap, "업체명");
      if (!company || existing[normalizeKey_(company)] || (marker !== "y" && marker !== "yes" && marker !== "예")) {
        continue;
      }

      var row = new Array(targetValues[0].length).fill("");
      setCell_(row, targetMap, "타깃ID", nextTargetId_(target));
      setCell_(row, targetMap, "업체명", company);
      setCell_(row, targetMap, "고객유형", getCell_(webRow, webMap, "고객유형"));
      setCell_(row, targetMap, "지역", getCell_(webRow, webMap, "지역"));
      setCell_(row, targetMap, "우선제품", getCell_(webRow, webMap, "제품군"));
      setCell_(row, targetMap, "담당자", getCell_(webRow, webMap, "담당자"));
      setCell_(row, targetMap, "연락처", getOfficialPhone_(webRow, webMap));
      setCell_(row, targetMap, "이메일", getOfficialEmail_(webRow, webMap));
      setCell_(row, targetMap, "출처", [
        getCell_(webRow, webMap, "공개 출처"),
        getCell_(webRow, webMap, "웹출처URL")
      ].join(" ").trim());
      setCell_(row, targetMap, "우선순위", getCell_(webRow, webMap, "A/B/C 등급"));
      setCell_(row, targetMap, "접촉상태", getCell_(webRow, webMap, "접촉단계") || "미접촉");
      setCell_(row, targetMap, "메모", [
        getCell_(webRow, webMap, "제안 현황"),
        getCell_(webRow, webMap, "메일 제목"),
        getCell_(webRow, webMap, "첫 접촉 포인트"),
        getCell_(webRow, webMap, "후속 연락 메모"),
        getCell_(webRow, webMap, "연락채널 메모"),
        getCell_(webRow, webMap, "크롤링메모")
      ].join(" / ").trim());
      setCell_(row, targetMap, "시설/자산 단서", getCell_(webRow, webMap, "시설/자산 단서"));
      setCell_(row, targetMap, "예산/투자 단서", getCell_(webRow, webMap, "예산/투자 단서"));
      setCell_(row, targetMap, "의사결정자 단서", getCell_(webRow, webMap, "의사결정자 단서"));
      setCell_(row, targetMap, "거래준비도 점수", getCell_(webRow, webMap, "거래준비도 점수"));
      setCell_(row, targetMap, "점수 사유", getCell_(webRow, webMap, "점수 사유"));
      setCell_(row, targetMap, "A/B/C 등급", getCell_(webRow, webMap, "A/B/C 등급"));
      setCell_(row, targetMap, "접촉단계", getCell_(webRow, webMap, "접촉단계") || "미접촉");
      setCell_(row, targetMap, "고객DB승격근거", getCell_(webRow, webMap, "고객DB승격근거") || "없음");
      setCell_(row, targetMap, "고객DB승격가능", getCell_(webRow, webMap, "고객DB승격가능"));
      setCell_(row, targetMap, "승격차단사유", getCell_(webRow, webMap, "승격차단사유"));
      target.appendRow(row);
      existing[normalizeKey_(company)] = true;
      moved += 1;
    }
    return moved;
  }

  function normalizeProcessFields_(sheet, rowNumber, row, headerMap) {
    var contactStage = getCell_(row, headerMap, "접촉단계");
    var evidence = getCell_(row, headerMap, "고객DB승격근거");
    var legacyStatus = getCell_(row, headerMap, "검증상태");
    if (!contactStage) {
      if (legacyStatus === "회신옴") contactStage = "회신옴";
      else if (legacyStatus === "오프라인접점") contactStage = "미팅완료";
      else if (legacyStatus === "부적합") contactStage = "부적합";
      else contactStage = "미접촉";
      writeByHeader_(sheet, rowNumber, "접촉단계", contactStage);
    }
    if (!evidence) {
      if (legacyStatus === "회신옴") evidence = "회신";
      else if (legacyStatus === "오프라인접점") evidence = "오프라인접점";
      else if (legacyStatus === "연락처확보") evidence = "연락처확보";
      else if (legacyStatus === "담당자확인") evidence = "담당자확인";
      else evidence = "없음";
      writeByHeader_(sheet, rowNumber, "고객DB승격근거", evidence);
    }
    if (!getCell_(row, headerMap, "타깃리스트반영")) writeByHeader_(sheet, rowNumber, "타깃리스트반영", "");
  }

  function rowToLead_(row, headerMap) {
    return {
      product: getCell_(row, headerMap, "제품군"),
      companyName: getCell_(row, headerMap, "업체명"),
      customerType: getCell_(row, headerMap, "고객유형"),
      region: getCell_(row, headerMap, "지역"),
      source: [
        getCell_(row, headerMap, "공개 출처"),
        getCell_(row, headerMap, "웹출처URL"),
        getCell_(row, headerMap, "출처 신뢰도")
      ].join(" "),
      contactChannel: getOfficialContactText_(row, headerMap),
      decisionSignal: getCell_(row, headerMap, "의사결정자 단서") || getCell_(row, headerMap, "담당자"),
      assetSignal: getCell_(row, headerMap, "시설/자산 단서"),
      budgetSignal: getCell_(row, headerMap, "예산/투자 단서"),
      urgentNeed: getCell_(row, headerMap, "추정 니즈"),
      notes: [
        getCell_(row, headerMap, "첫 접촉 포인트"),
        getCell_(row, headerMap, "연락채널 메모"),
        getCell_(row, headerMap, "크롤링메모")
      ].join(" ")
    };
  }

  function rowToPromotionLead_(row, headerMap, grade) {
    return {
      grade: grade,
      contactStage: getCell_(row, headerMap, "접촉단계"),
      promotionEvidence: getCell_(row, headerMap, "고객DB승격근거"),
      contactChannel: getOfficialContactText_(row, headerMap),
      contactName: getCell_(row, headerMap, "담당자"),
      phone: getOfficialPhone_(row, headerMap),
      email: getOfficialEmail_(row, headerMap),
      notes: [
        getCell_(row, headerMap, "연락채널 메모"),
        getCell_(row, headerMap, "크롤링메모")
      ].join(" ")
    };
  }

  function getOrCreateSheet_(ss, name) {
    return ss.getSheetByName(name) || ss.insertSheet(name);
  }

  function rebuildSheetByHeaderOrder_(sheet, preferredHeaders) {
    if (sheet.getFilter()) sheet.getFilter().remove();
    sheet.showColumns(1, sheet.getMaxColumns());
    var lastColumn = Math.max(sheet.getLastColumn(), 1);
    var lastRow = Math.max(sheet.getLastRow(), 1);
    var values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
    var oldHeaders = values[0].filter(String);
    var oldMap = getHeaderMap_(oldHeaders);
    var orderedHeaders = preferredHeaders.slice();
    oldHeaders.forEach(function (header) {
      if (orderedHeaders.indexOf(header) === -1) orderedHeaders.push(header);
    });

    var rebuilt = [orderedHeaders];
    for (var i = 1; i < values.length; i += 1) {
      var oldRow = values[i];
      var newRow = orderedHeaders.map(function (header) {
        return getRebuiltCell_(oldRow, oldMap, header);
      });
      rebuilt.push(newRow);
    }

    sheet.clear();
    if (sheet.getMaxColumns() < orderedHeaders.length) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), orderedHeaders.length - sheet.getMaxColumns());
    }
    sheet.getRange(1, 1, rebuilt.length, orderedHeaders.length).setValues(rebuilt);
    sheet.setFrozenRows(1);
  }

  function getRebuiltCell_(oldRow, oldMap, header) {
    var index = oldMap[header];
    if (index !== undefined) return oldRow[index];
    var legacyContact = getCell_(oldRow, oldMap, "공식 연락채널");
    if (header === "공식 전화번호") return extractPhones_(legacyContact).join(" / ");
    if (header === "공식 이메일") return firstValue_(extractEmails_(legacyContact));
    if (header === "연락채널 메모") return extractContactMemo_(legacyContact);
    return "";
  }

  function enrichKnownContactDetails_(sheet) {
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return;
    var headerMap = getHeaderMap_(values[0]);
    for (var i = 1; i < values.length; i += 1) {
      var rowNumber = i + 1;
      var company = normalizeText_(getCell_(values[i], headerMap, "업체명"));
      if (company.indexOf("ak플라자") !== -1 && company.indexOf("분당") !== -1) {
        writeByHeader_(sheet, rowNumber, "공식 전화번호", "1661-1114");
        writeByHeader_(sheet, rowNumber, "공식 이메일", "hk-kang@aekyung.kr");
        writeByHeader_(sheet, rowNumber, "담당자", "강호경 F&B팀장");
        writeByHeader_(sheet, rowNumber, "연락채널 메모", "AK 상품본부 F&B팀. 팝업/델리/베이커리&디저트 담당: 조연영 yeonyoung2@aekyung.kr, 이재영 leey.11@aekyung.kr, 김선진 clive420@aekyung.kr. NSC 테넌트 카페/베이커리/레스토랑: 임성수 lss0906@aekyung.kr. 푸드홀/팝업: 김경아 kyungah@aekyung.kr, 한정길 rightway@aekyung.kr.");
      }
      if (company.indexOf("현대백화점") !== -1 && company.indexOf("판교") !== -1) {
        writeByHeader_(sheet, rowNumber, "공식 전화번호", getCell_(values[i], headerMap, "공식 전화번호") || "1588-3650");
        writeByHeader_(sheet, rowNumber, "연락채널 메모", getCell_(values[i], headerMap, "연락채널 메모") || "고객상담실/채팅 상담 공식 채널. F&B·푸드홀·디저트 팝업 담당 부서 또는 제안 접수 창구 안내 대기.");
      }
    }
  }

  function enrichMailingFields_(sheet) {
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return;
    var headerMap = getHeaderMap_(values[0]);
    for (var i = 1; i < values.length; i += 1) {
      if (!getCell_(values[i], headerMap, "업체명")) continue;
      var rowNumber = i + 1;
      var item = rowToMailItem_(values[i], headerMap);
      if (!getCell_(values[i], headerMap, "권장 연락방법")) {
        writeByHeader_(sheet, rowNumber, "권장 연락방법", buildRecommendedContactMethod_(item));
      }
      if (!getCell_(values[i], headerMap, "메일 제목")) {
        writeByHeader_(sheet, rowNumber, "메일 제목", buildEmailSubject_(item));
      }
      if (!getCell_(values[i], headerMap, "메일 초안")) {
        writeByHeader_(sheet, rowNumber, "메일 초안", buildEmailDraft_(item));
      }
      if (!getCell_(values[i], headerMap, "제안 현황")) {
        writeByHeader_(sheet, rowNumber, "제안 현황", defaultProposalStatus_(getCell_(values[i], headerMap, "접촉단계")));
      }
      if (!getCell_(values[i], headerMap, "후속 연락 메모")) {
        writeByHeader_(sheet, rowNumber, "후속 연락 메모", "발송/접수 후 마지막 제안일과 다음 연락일을 업데이트.");
      }
    }
  }

  function rowToMailItem_(row, headerMap) {
    return {
      company: getCell_(row, headerMap, "업체명"),
      product: getCell_(row, headerMap, "제품군"),
      type: getCell_(row, headerMap, "고객유형"),
      region: getCell_(row, headerMap, "지역"),
      phone: getOfficialPhone_(row, headerMap),
      email: getOfficialEmail_(row, headerMap),
      contact: getOfficialContactText_(row, headerMap),
      manager: getCell_(row, headerMap, "담당자"),
      contactMemo: getCell_(row, headerMap, "연락채널 메모"),
      point: getCell_(row, headerMap, "첫 접촉 포인트"),
      needs: getCell_(row, headerMap, "추정 니즈")
    };
  }

  function buildRecommendedContactMethod_(item) {
    var text = [
      item.company,
      item.product,
      item.type,
      item.contact,
      item.contactMemo
    ].join(" ");
    if (item.email) return "이메일 발송 후 2~3영업일 내 전화 확인";
    if (containsAnyText_(text, ["채팅", "고객상담실"])) return "채팅상담으로 담당부서/접수창구 확인 후 이메일 발송";
    if (containsAnyText_(text, ["문의폼", "contact us", "고객센터", "공식"])) return "공식 문의/고객센터 접수 후 전화로 담당부서 확인";
    if (item.phone) return "전화로 담당부서 확인 후 이메일 주소 요청";
    return "공식 채널 추가 확인 후 연락";
  }

  function buildEmailSubject_(item) {
    var company = item.company || "{회사명}";
    var text = [item.product, item.type, item.company].join(" ");
    if (containsAnyText_(text, ["백화점", "푸드홀", "f&b", "델리", "디저트", "alphacafe"])) {
      return "[제휴/입점 문의] " + company + " F&B·푸드홀 프리미엄 딸기 디저트/팝업 제안";
    }
    if (containsAnyText_(text, ["호텔", "라운지", "experience", "mice"])) {
      return "[제휴 문의] " + company + " F&B·라운지 프리미엄 딸기 디저트/라이브 쇼케이스 제안";
    }
    if (containsAnyText_(text, ["40ft", "농업기술센터", "실증", "교육"])) {
      return "[실증/교육 문의] " + company + " 죽향 딸기 컨테이너팜 파일럿 검토 문의";
    }
    if (containsAnyText_(text, ["asean", "해외", "글로벌"])) {
      return "[해외진출/실증 문의] " + company + " ASEAN 현지 검증·사업화 협력 문의";
    }
    return "[B2B 제안] " + company + " 프리미엄 죽향 딸기 안정생산·공급 협업 문의";
  }

  function buildEmailDraft_(item) {
    var company = item.company || "귀사";
    var bodyType = [item.product, item.type, item.company].join(" ");
    var proposalLines = buildProposalLines_(bodyType);
    return [
      "안녕하세요.",
      "쎄슬프라이머스 영업·마케팅 담당 강호수 프로입니다.",
      "",
      company + " 담당 부서와 연결 가능한 AlphaFarm 제안 건으로 연락드립니다.",
      "",
      "AlphaFarm은 프리미엄 죽향 딸기를 안정적으로 재배하고,",
      "이를 디저트·생과·소포장·음료 또는 라이브 재배 쇼케이스로 연결하는",
      "프리미엄 딸기 비즈니스 시스템입니다.",
      "",
      company + " 관점에서는 아래 방향으로 검토 가능할 것으로 보입니다.",
      "",
      proposalLines,
      "",
      "가격이나 수익률 자료를 먼저 보내려는 목적은 아니며,",
      "담당 부서 적합성과 제안 접수 절차를 먼저 확인드리고자 합니다.",
      "",
      "가능하시다면 관련 담당자 또는 제안 접수 창구를 안내 부탁드립니다.",
      "검토 가능하신 경우 10~15분 정도 화상 또는 방문으로 간단히 설명드리겠습니다.",
      "",
      "감사합니다.",
      "",
      "강호수 프로",
      "쎄슬프라이머스 / 영업·마케팅",
      "rkdghtn6036@gmail.com"
    ].join("\n");
  }

  function buildProposalLines_(text) {
    if (containsAnyText_(text, ["백화점", "푸드홀", "f&b", "델리", "디저트", "alphacafe"])) {
      return [
        "1. 프리미엄 죽향 딸기 기반 디저트/생과/소포장 상품 협업",
        "2. 푸드홀·델리·베이커리·디저트 팝업 연계",
        "3. 실제 딸기가 자라는 라이브 재배 쇼케이스를 활용한 공간 차별화"
      ].join("\n");
    }
    if (containsAnyText_(text, ["호텔", "라운지", "experience", "mice"])) {
      return [
        "1. 시즌 디저트/뷔페/라운지 메뉴용 프리미엄 죽향 딸기 협업",
        "2. 로비·라운지·F&B 공간의 라이브 재배 쇼케이스 연출",
        "3. 기업행사·프로모션용 프리미엄 딸기 경험 콘텐츠"
      ].join("\n");
    }
    if (containsAnyText_(text, ["40ft", "농업기술센터", "실증", "교육"])) {
      return [
        "1. 대규모 투자 전 소형 파일럿 실증",
        "2. 교육·체험형 스마트농업 콘텐츠 연계",
        "3. 컨테이너·냉방·전력·배수 등 현장 조건 확인 후 검토"
      ].join("\n");
    }
    if (containsAnyText_(text, ["asean", "해외", "글로벌"])) {
      return [
        "1. ASEAN 현지 시장검증 및 파트너 발굴",
        "2. 고온다습 환경의 저온·제습·품질 이슈 검토",
        "3. 현지 실증 기반 사업화 제안 구조 검토"
      ].join("\n");
    }
    return [
      "1. 프리미엄 죽향 딸기의 안정 생산·공급 협업",
      "2. B2B 식자재/디저트/신선식품 채널 연계",
      "3. 담당 부서 적합성 확인 후 파일럿 검토"
    ].join("\n");
  }

  function defaultProposalStatus_(contactStage) {
    if (contactStage === "메일발송") return "메일발송";
    if (contactStage === "온라인접수") return "온라인접수";
    if (contactStage === "회신옴") return "회신옴";
    if (contactStage === "미팅예정") return "미팅예정";
    if (contactStage === "미팅완료") return "미팅완료";
    if (contactStage === "부적합") return "부적합";
    return "메일초안작성";
  }

  function ensureHeaders_(sheet, headers) {
    var lastColumn = Math.max(sheet.getLastColumn(), 1);
    var existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].filter(String);
    var existingMap = getHeaderMap_(existing);
    var changed = false;
    headers.forEach(function (header) {
      if (existingMap[header] === undefined) {
        existing.push(header);
        existingMap[header] = existing.length - 1;
        changed = true;
      }
    });
    if (changed || sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, existing.length).setValues([existing]);
      sheet.setFrozenRows(1);
    }
  }

  function applySheetFormat_(sheet) {
    var lastRow = Math.max(sheet.getLastRow(), 1);
    var lastColumn = Math.max(sheet.getLastColumn(), WEB_HEADERS.length);
    var headerMap = getHeaderMap_(sheet.getRange(1, 1, 1, lastColumn).getValues()[0]);

    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(10);
    sheet.getRange(1, 1, lastRow, lastColumn)
      .setFontFamily("Arial")
      .setFontSize(10)
      .setVerticalAlignment("middle")
      .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    sheet.getRange(1, 1, 1, lastColumn)
      .setBackground("#0f5b78")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    sheet.setRowHeight(1, 34);
    if (lastRow > 1) sheet.setRowHeights(2, lastRow - 1, 38);

    setWidths_(sheet, headerMap, {
      "수집ID": 82,
      "접촉단계": 110,
      "고객DB승격근거": 130,
      "고객DB승격가능": 110,
      "타깃리스트반영": 110,
      "A/B/C 등급": 90,
      "거래준비도 점수": 100,
      "다음액션": 210,
      "업체명": 210,
      "제품군": 160,
      "고객유형": 180,
      "지역": 120,
      "공식 전화번호": 130,
      "공식 이메일": 220,
      "담당자": 150,
      "권장 연락방법": 210,
      "메일 제목": 260,
      "메일 초안": 420,
      "제안 현황": 110,
      "마지막 제안일": 90,
      "다음 연락일": 90,
      "후속 연락 메모": 240,
      "연락채널 메모": 340,
      "첫 접촉 포인트": 260,
      "추정 니즈": 260,
      "시설/자산 단서": 240,
      "예산/투자 단서": 240,
      "의사결정자 단서": 220,
      "웹출처URL": 100,
      "수집일": 80,
      "수집채널": 80,
      "검색쿼리": 80,
      "점수 사유": 360,
      "승격차단사유": 280,
      "크롤링메모": 280
    });

    ["다음액션", "권장 연락방법", "메일 제목", "메일 초안", "후속 연락 메모", "연락채널 메모", "첫 접촉 포인트", "추정 니즈", "시설/자산 단서", "예산/투자 단서", "의사결정자 단서", "점수 사유", "승격차단사유", "크롤링메모"].forEach(function (header) {
      var col = headerMap[header];
      if (col !== undefined) sheet.getRange(2, col + 1, Math.max(sheet.getMaxRows() - 1, 1), 1).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
    });

    applyValidation_(sheet, headerMap, "접촉단계", ["미접촉", "온라인접수", "메일발송", "전화시도", "방문시도", "회신옴", "미팅예정", "미팅완료", "부적합"]);
    applyValidation_(sheet, headerMap, "고객DB승격근거", ["없음", "회신", "오프라인접점", "연락처확보", "담당자확인"]);
    applyValidation_(sheet, headerMap, "타깃리스트반영", ["Y", "N", ""]);
    applyValidation_(sheet, headerMap, "A/B/C 등급", ["A", "B", "C", "보류"]);
    applyValidation_(sheet, headerMap, "제안 현황", ["미제안", "메일초안작성", "컨펌대기", "메일발송", "온라인접수", "전화시도", "회신대기", "회신옴", "미팅예정", "미팅완료", "보류", "부적합"]);
    applyValidation_(sheet, headerMap, "제품군", ["AlphaCafe", "Alpha Experience Portfolio", "AlphaFarm Core", "40ft HC ContainerFarm", "ASEAN Service", "확인 필요"]);

    if (sheet.getFilter()) sheet.getFilter().remove();
    sheet.getRange(1, 1, lastRow, lastColumn).createFilter();
    applyConditionalFormats_(sheet, headerMap, lastRow);
    hideLegacyColumns_(sheet, headerMap);
  }

  function setWidths_(sheet, headerMap, widths) {
    Object.keys(widths).forEach(function (header) {
      if (headerMap[header] !== undefined) sheet.setColumnWidth(headerMap[header] + 1, widths[header]);
    });
  }

  function applyValidation_(sheet, headerMap, header, values) {
    var col = headerMap[header];
    if (col === undefined) return;
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
    sheet.getRange(2, col + 1, Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(rule);
  }

  function applyConditionalFormats_(sheet, headerMap, lastRow) {
    var rules = [];
    function textRule(header, value, background, fontColor) {
      var col = headerMap[header];
      if (col === undefined) return;
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(value)
        .setBackground(background)
        .setFontColor(fontColor || "#111111")
        .setRanges([sheet.getRange(2, col + 1, Math.max(lastRow - 1, 1), 1)])
        .build());
    }
    textRule("접촉단계", "미접촉", "#f1f5f9");
    textRule("접촉단계", "온라인접수", "#dbeafe");
    textRule("접촉단계", "메일발송", "#e0e7ff");
    textRule("접촉단계", "전화시도", "#fef3c7");
    textRule("접촉단계", "방문시도", "#ffedd5");
    textRule("접촉단계", "회신옴", "#dcfce7");
    textRule("접촉단계", "미팅예정", "#ccfbf1");
    textRule("접촉단계", "미팅완료", "#bbf7d0");
    textRule("접촉단계", "부적합", "#fee2e2");
    textRule("고객DB승격근거", "없음", "#f8fafc");
    textRule("고객DB승격근거", "회신", "#dcfce7");
    textRule("고객DB승격근거", "오프라인접점", "#bbf7d0");
    textRule("고객DB승격근거", "연락처확보", "#dbeafe");
    textRule("고객DB승격근거", "담당자확인", "#ccfbf1");
    textRule("고객DB승격가능", "Y", "#22c55e", "#ffffff");
    textRule("고객DB승격가능", "N", "#f1f5f9");
    textRule("타깃리스트반영", "Y", "#2563eb", "#ffffff");
    textRule("A/B/C 등급", "A", "#16a34a", "#ffffff");
    textRule("A/B/C 등급", "B", "#0ea5e9", "#ffffff");
    textRule("A/B/C 등급", "C", "#facc15");
    textRule("A/B/C 등급", "보류", "#fecaca");
    textRule("제안 현황", "메일초안작성", "#e0f2fe");
    textRule("제안 현황", "컨펌대기", "#fef3c7");
    textRule("제안 현황", "메일발송", "#e0e7ff");
    textRule("제안 현황", "온라인접수", "#dbeafe");
    textRule("제안 현황", "회신대기", "#fef9c3");
    textRule("제안 현황", "회신옴", "#dcfce7");
    textRule("제안 현황", "미팅예정", "#ccfbf1");
    textRule("제안 현황", "미팅완료", "#bbf7d0");
    textRule("제안 현황", "보류", "#fee2e2");
    sheet.setConditionalFormatRules(rules);
  }

  function hideLegacyColumns_(sheet, headerMap) {
    ["검증상태", "공식 연락채널", "공개연락채널"].forEach(function (header) {
      var col = headerMap[header];
      if (col !== undefined) sheet.hideColumns(col + 1);
    });
  }

  function getOfficialPhone_(row, headerMap) {
    return getCell_(row, headerMap, "공식 전화번호") || extractPhones_(getCell_(row, headerMap, "공식 연락채널")).join(" / ");
  }

  function getOfficialEmail_(row, headerMap) {
    return getCell_(row, headerMap, "공식 이메일") || firstValue_(extractEmails_(getCell_(row, headerMap, "공식 연락채널")));
  }

  function getOfficialContactText_(row, headerMap) {
    return [
      getOfficialPhone_(row, headerMap),
      getOfficialEmail_(row, headerMap),
      getCell_(row, headerMap, "연락채널 메모"),
      getCell_(row, headerMap, "공식 연락채널")
    ].join(" ");
  }

  function extractPhones_(text) {
    var matches = String(text || "").match(/(?:\+?\d{1,3}[-\s]?)?(?:0\d{1,2}|1\d{3}|080)[-\s]?\d{3,4}[-\s]?\d{4}/g) || [];
    return uniqueValues_(matches.map(function (value) {
      return String(value).replace(/\s+/g, "").trim();
    }));
  }

  function extractEmails_(text) {
    var matches = String(text || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig) || [];
    return uniqueValues_(matches.map(function (value) {
      return String(value).trim();
    }));
  }

  function extractContactMemo_(text) {
    var memo = String(text || "");
    extractEmails_(memo).forEach(function (email) {
      memo = memo.replace(email, " ");
    });
    extractPhones_(memo).forEach(function (phone) {
      var pattern = phone.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/-/g, "[-\\s]?");
      memo = memo.replace(new RegExp(pattern, "g"), " ");
    });
    return memo.replace(/[\/|]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function uniqueValues_(values) {
    var seen = {};
    var result = [];
    values.forEach(function (value) {
      var key = String(value || "").toLowerCase();
      if (!key || seen[key]) return;
      seen[key] = true;
      result.push(value);
    });
    return result;
  }

  function firstValue_(values) {
    return values && values.length ? values[0] : "";
  }

  function getHeaderMap_(headers) {
    var map = {};
    headers.forEach(function (header, index) {
      if (header !== "" && header !== null && header !== undefined) map[String(header)] = index;
    });
    return map;
  }

  function writeByHeader_(sheet, row, header, value) {
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var headerMap = getHeaderMap_(headers);
    if (headerMap[header] === undefined) {
      ensureHeaders_(sheet, [header]);
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      headerMap = getHeaderMap_(headers);
    }
    sheet.getRange(row, headerMap[header] + 1).setValue(value);
  }

  function getCell_(row, headerMap, header) {
    var index = headerMap[header];
    return index === undefined ? "" : row[index];
  }

  function setCell_(row, headerMap, header, value) {
    var index = headerMap[header];
    if (index !== undefined) row[index] = value;
  }

  function nextWebLeadId_(sheet) {
    return "W-" + ("0000" + Math.max(sheet.getLastRow(), 1)).slice(-4);
  }

  function nextTargetId_(sheet) {
    return "T-" + ("0000" + Math.max(sheet.getLastRow(), 1)).slice(-4);
  }

  function normalizeKey_(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "");
  }

  function normalizeText_(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "").trim();
  }

  function containsAnyText_(text, keywords) {
    var normalized = normalizeText_(text);
    return keywords.some(function (keyword) {
      return normalized.indexOf(normalizeText_(keyword)) !== -1;
    });
  }

  return {
    setupWebLeadDb: setupWebLeadDb,
    applyWebLeadDbView: applyWebLeadDbView,
    scoreWebLeadDb: scoreWebLeadDb,
    seedResearchBriefWebLeads: seedResearchBriefWebLeads,
    seedSeoulGyeonggiDemandLeads: seedSeoulGyeonggiDemandLeads,
    promoteSelectedWebLeadsToTargetList: promoteSelectedWebLeadsToTargetList
  };
})();
