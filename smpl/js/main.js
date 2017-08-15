'use strict';

$(function(){
  const tmpl = {
    records: ''
  };

  // 主要elementのjQueryオブジェクト
  const $eles = {
    parent: undefined,
    searchArea: undefined,
    results: undefined,
  };

  /**
   * APIリクエストオブジェクト
   */
  const requestObj = function() {
    const defaultModel = {
      "object_kind": '165',       // 物件種別
      "sort": 'price_asc',        // 並び順
      "disp_num": '10',           // 検索結果１ページに表示する最大件数
      "page": '1'                 // ページNo
    };

    const model = $.extend({}, defaultModel);

    return {
      getModel: function() {
        return model;
      },
      setModel: function(_model) {
        $.each($.extend(model, _model), function(key, val) {
          if (val === null || val === '') {
            if (key in defaultModel) {
              model[key] = defaultModel[key];
            } else {
              delete model[key];
            }
          }
        });
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

    $eles.resultArea.hide();
  };

  /**
   * JSONP通信により、物件データ取得
   *
   * @param searchCondition 検索条件
   * @return promise
   */
  const dataLoader = function (searchCondition) {
    var deferred = new $.Deferred;

    // deferred.resolve({object:[{object_id: 123},{object_id: 124}]}, 'success', {});

    $.jsonp({
      url: "http://dev_homepage_agent.agent-master.jp/api/v1/object/",
      data: searchCondition,
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
      const object = datas.object;

      if (!$.isArray(object) || object.length <= 0) {
        // 検索結果が0件
        deferred.resolve(0);
        return;
      }

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
      const end_point = (start_point - 1) + object.length;
      $eles.parent.find('.ams-start-point').html(start_point);
      $eles.parent.find('.ams-end-point').html(end_point);

      // 一覧表示
      const $parent = $eles.results.parent(); // 親要素
      $eles.results.remove(); // ams-search-resultsクラスがつくものをすべて除去
      $.each(object, function(i, n) {
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

      $eles.resultArea.show();

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
  $eles.searchArea = $eles.parent.find('#searchArea');
  $eles.resultArea = $eles.parent.find('#resultArea');
  $eles.results = $eles.parent.find('.ams-search-results');

  tmpl.records = $eles.results.prop('outerHTML');

  clsDispDatas();

  // 検索条件
  const req = requestObj();

  // 検索ボタン押下イベント
  $eles.searchArea.find('#btn_search').on('click', function(e) {
    e.preventDefault();

    // フォームの内容をJSONに変換
    const formData = new FormData($eles.searchArea.find('form').get(0));
    const searchCondition = {};
    for (var entry of formData.entries()) {
      searchCondition[entry[0]] = entry[1];
    }

    // リクエストモデルにセット
    req.setModel(searchCondition);

    // 検索開始
    search(req.getModel());
  });

});
