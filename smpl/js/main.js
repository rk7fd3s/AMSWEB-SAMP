'use strict';

$(function(){
  const tmpl = {
    records: ''
  };

  // 主要elementのjQueryオブジェクト
  const $eles = {
    parent: undefined,
    condition: undefined,
    results: undefined,
  };

  /**
   * APIリクエストオブジェクト
   */
  const requestObj = function() {
    const model = {
      "api_key": null,
      "object_kind": null,
      "charset": null,
      "is_img": null,
      "price_lower": null,
      "price_upper": null,
      "room_layout": null,
      "square_total_lower": null,
      "square_total_upper": null,
      "square_lower": null,
      "square_upper": null,
      "required_time": null,
      "complete_ym": null,
      "address": null,
      "primary_school": null,
      "junior_high_school": null,
      "sort": null,                 // 並び順
      "disp_num": null,             // 検索結果１ページに表示する最大件数
      "page": null                  // ページNo
    };

    return {
      getModel: function() {
        return model;
      },
      setModelItem: function(key, val) {
        model[key] = val;
      },
      getPage: function() {
        return (model.page && !isNaN(model.page) && model.page > 0) ? Math.ceil(model.page) : 1;
      },
      getMax: function() {
        return (model.disp_num && !isNaN(model.disp_num) && model.disp_num > 0) ? Math.ceil(model.disp_num) : 10;
      }
    };
  };

  /**
   * 画面を初期化する
   *
   */
  const clsDispDatas = function() {
    // data-init属性がある項目はその値で初期化
    $eles.parent.find('[data-init]').filter(function(n) {
      return ($(this).attr('class').indexOf('ams-') >= 0);
    }).each(function() {
      $(this).text($(this).data('init'));
    });

    $eles.condition.empty().text('{}');
    $eles.results.empty().text('{}');
  };

  /**
   * JSONP通信により、物件データ取得
   *
   * @param searchCondition 検索条件
   * @return promise
   */
  const dataLoader = function (searchCondition) {
    var deferred = new $.Deferred;

    console.log(searchCondition);

    const datas = [
      {
        "object_id": "11111111",
        "address_name": "福岡県大野城市若草１丁目",
        "access1": "博多南線",
        "object_price": "1699",
        "object_kind": "土地",
        "land_square": "111.25",
        "complete_ym": "1900年01月",
        "room_layout": "3LDK",
        "building_square_total": "300.1",
        "object_name": "ダイアパレスリブレ南笹口",
        "square": "70.86",
        "square_kind": "壁芯",
        "update_time": "2017年07月25日",
        "update_schedual": "2017年08月01日",
        "architectural_condition": "更地渡し(建築条件なし)",
        "land_auth": "所有権",
        "chimoku": "宅地",
        "current_state": "居住中",
        "private_road": "20",
        "private_road_king": "含",
        "road_square": "北",
        "building_to_land_ratio": "60%",
        "floor_area_ratio": "200%",
        "vacate": "相談",
        "own_trade_status": "一般一般一般一般",
        "city_planning": "市街化区域",
        "use_district": "2種中高",
        "primary_school": "小学校区",
        "junior_high_school": "中学校区",
        "equipment": "上水道,下水道,電気,側溝,テラス",
        "comment": "備考",
        "object_no": "A123456789",
        "building_structure_ground": "11階",
        "building_structure": "木造木造木造",
        "building_kakunin_no": "許可等の処分の番号",
        "trader_name": "テスト業者名テスト業者名テスト業者名",
        "trader_address": "福岡県大野城市若草１丁目",
        "trader_tel": "00-0000-0000",
        "trader_license_number": "東京都知事（1）第000000号東京都知事（1）第000000号東京都知事（1）第000000号\n業者免許番号業者免許番号業者免許番号",
        "management_cost": "7,810円/月",
        "repair_cost": "4,610円/月",
        "management_form": "管理形態：委託管理",
        "parking_cost": "空有(敷地内)",
        "balcony": "11.64",
        "floor": "6階",
        "filename_room_layout": "http://～",
        "filename_exterior1": "http://～",
        "filename_exterior2": "http://～",
        "filename_exterior3": "http://～",
        "filename_exterior4": "http://～",
        "filename_exterior5": "http://～",
        "filename_exterior6": "http://～",
        "filename_exterior7": "http://～",
        "filename_exterior8": "http://～",
        "filename_exterior9": "http://～",
        "filename_exterior10": "http://～",
        "filename_exterior11": "http://～",
        "filename_exterior12": "http://～",
        "filename_exterior13": "http://～",
        "filename_exterior14": "http://～",
        "filename_exterior15": "http://～",
        "filename_exterior16": "http://～",
        "filename_exterior17": "http://～",
        "filename_exterior18": "http://～",
        "filename_exterior19": "http://～",
        "filename_exterior20": "http://～"
      },
        {
          "object_id": "11111111",
          "address_name": "福岡県大野城市若草１丁目",
          "access1": "博多南線",
          "object_price": "1699",
          "object_kind": "土地",
          "land_square": "111.25",
          "complete_ym": "1900年01月",
          "room_layout": "3LDK",
          "building_square_total": "300.1",
          "object_name": "ダイアパレスリブレ南笹口",
          "square": "70.86",
          "square_kind": "壁芯",
          "update_time": "2017年07月25日",
          "update_schedual": "2017年08月01日",
          "architectural_condition": "更地渡し(建築条件なし)",
          "land_auth": "所有権",
          "chimoku": "宅地",
          "current_state": "居住中",
          "private_road": "20",
          "private_road_king": "含",
          "road_square": "北",
          "building_to_land_ratio": "60%",
          "floor_area_ratio": "200%",
          "vacate": "相談",
          "own_trade_status": "一般一般一般一般",
          "city_planning": "市街化区域",
          "use_district": "2種中高",
          "primary_school": "小学校区",
          "junior_high_school": "中学校区",
          "equipment": "上水道,下水道,電気,側溝,テラス",
          "comment": "備考",
          "object_no": "A123456789",
          "building_structure_ground": "11階",
          "building_structure": "木造木造木造",
          "building_kakunin_no": "許可等の処分の番号",
          "trader_name": "テスト業者名テスト業者名テスト業者名",
          "trader_address": "福岡県大野城市若草１丁目",
          "trader_tel": "00-0000-0000",
          "trader_license_number": "東京都知事（1）第000000号東京都知事（1）第000000号東京都知事（1）第000000号\n業者免許番号業者免許番号業者免許番号",
          "management_cost": "7,810円/月",
          "repair_cost": "4,610円/月",
          "management_form": "管理形態：委託管理",
          "parking_cost": "空有(敷地内)",
          "balcony": "11.64",
          "floor": "6階",
          "filename_room_layout": "http://～",
          "filename_exterior1": "http://～",
          "filename_exterior2": "http://～",
          "filename_exterior3": "http://～",
          "filename_exterior4": "http://～",
          "filename_exterior5": "http://～",
          "filename_exterior6": "http://～",
          "filename_exterior7": "http://～",
          "filename_exterior8": "http://～",
          "filename_exterior9": "http://～",
          "filename_exterior10": "http://～",
          "filename_exterior11": "http://～",
          "filename_exterior12": "http://～",
          "filename_exterior13": "http://～",
          "filename_exterior14": "http://～",
          "filename_exterior15": "http://～",
          "filename_exterior16": "http://～",
          "filename_exterior17": "http://～",
          "filename_exterior18": "http://～",
          "filename_exterior19": "http://～",
          "filename_exterior20": "http://～"
        }
    ];

    deferred.resolve(datas, undefined, undefined);
/*
    $.jsonp({
      url: "http://www.usamimi.info/~ryouchi/title/get_title_jsonp.php",
      data: {url: 'http://phiary.me'}, //searchCondition,
      timeout: 10000,
      success: function (json, textStatus, xOptions) {
        // 取得成功
        deferred.resolve(json, textStatus, xOptions);
      },
      error : function (xOptions, textStatus) {
        // 取得失敗
        deferred.reject(xOptions, textStatus);
      },
      callbackParameter: "callback"
    });
*/
    return deferred.promise();
  };

  /**
   * 検索条件に基づきデータ取得を行い、画面表示を行う
   *
   * @param searchCondition 検索条件
   * @return promise
   */
  const search = function(searchCondition) {
    var deferred = new $.Deferred;
    console.log('search process start');

    /**
     * 引数のjsonデータを画面にはめ込む
     *
     * @param datas
     */
    const putDispDatas = function(datas) {
      if (!$.isArray(datas) || datas.length <= 0) {
        // 検索結果が0件
        deferred.resolve(0);
      }

      // 検索条件モデル
      const searchCondition = req.getModel();
      // 現ページ番号
      const page_num = req.getPage();
      // １ページあたりの最大件数
      const max_num = req.getMax();
      $eles.parent.find('.ams-max-num').html(max_num);

      // 総件数
      // TODO
      const total_num = 1;
      $eles.parent.find('.ams-total-num').html(total_num);

      // 現表示範囲
      const start_point = (page_num - 1) * max_num + 1;
      const end_point = (start_point - 1) + datas.length;
      $eles.parent.find('.ams-start-point').html(start_point);
      $eles.parent.find('.ams-end-point').html(end_point);

      // 検索条件
      $eles.parent.find('.ams-search-condition').html(JSON.stringify(searchCondition));

      // 一覧表示
      const $parent = $eles.results.parent(); // 親要素
      $eles.results.remove(); // ams-search-resultsクラスがつくものをすべて除去
      $.each(datas, function(i, n) {
        const $contener = $(tmpl.records);  // テンプレートをからjQueryオブジェクト生成

        for (let key in this) {
          let val = this[key];
          $contener.find('.ams-' + key).filter(function(n) {
            return (this.nodeName === 'INPUT');
          }).val(val);
          $contener.find('.ams-' + key).filter(function(n) {
            return (this.nodeName !== 'INPUT');
          }).html(val);
        }

        $contener.data('object_id', this.object_id);

        $parent.append($contener);
      });

      deferred.resolve();
    };

    // 検索条件を素にAPIからデータ取得
    dataLoader(searchCondition)
    .done(function(json, textStatus, xOptions) {
      // 取得成功
      clsDispDatas();
      putDispDatas(json);
    }).fail(function(xOptions, textStatus) {
      // 取得失敗
      console.log(textStatus);
      deferred.reject();
    });

    return deferred.promise().always(function() {
      console.log('search process fin');
    });
  };

  // オブジェクト設定
  $eles.parent = $('#mainArea');
  $eles.condition = $eles.parent.find('.ams-search-condition');
  $eles.results = $eles.parent.find('.ams-search-results');

  tmpl.records = $eles.results.prop('outerHTML');

  clsDispDatas();

  // 検索条件
  const req = requestObj();
  const searchCondition = req.getModel();



  // 検索開始
  search(searchCondition);


});
