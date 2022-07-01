<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

//for datetime parsing
use Carbon\Carbon;
//for uuid
use Illuminate\Support\Str;

use App\Study;
use App\Category;
use App\Statistic;

class StudyController extends Controller
{
    static public function showById(Request $request)
    {
        try {
            $id = $request->input('id');
            if (!$id) {
                return null;
            }
            $data = Study::select('id', 'title', 'content')->where('id', $id)->firstOrFail();
            if ($data->confirm == 0)
                return null;
            return $data;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * 取出符合條件的已審核資料，並以創建時間遞減排序
     * 
     * 可用參數：
     *   - num=n                    取出前 n 筆符合條件的資料
     *   - from=id                  篩選創建時間早於 id 的資料
     *   - p=str                    篩選標題或內文中有 str 的資料
     *   - category=id1,id2,...     篩選有類別 id1 或 id2 的資料
     *   - statistic=id1,id2,...    篩選有統計資料 id1 或 id2 的資料
     */
    public function show(Request $request)
    {
        $from = $request->input('from');
        $date = $from ? Carbon::parse(Study::find($from)['created_at'])->format('Y-m-d H:i:s') : Carbon::now()->toDateTimeString();

        $studies = Study::select('id', 'title', 'year', 'major', 'confirm', 'created_at as timestamp', 'content', 'tmp1.category', 'tmp2.statistic')
            ->where('confirm', true)
            ->where('created_at', '<=', $date)
            ->where(function ($query) use ($request) {
                $input = $request->input("p");
                if (!$input)
                    return;
                $query->where('title', 'like', '%' . $input . '%')->orWhere('content', 'like', '%' . $input . '%');
            })
            ->joinSub(function ($query) use ($request) {
                $query->select(DB::raw("study_id, group_concat('{ \"id\": \"', filter1.id, '\",\"name\": \"', filter1.name,'\" }') as category"))
                    ->from('Category')
                    ->joinSub(function ($query) use ($request) {
                        $query->from('CategoryManage');
                        $input = $request->input("category");
                        if (!$input)
                            return;
                        $query->whereIn('id', explode(',', $input));
                    }, 'filter1', 'Category.id', '=', 'filter1.id')
                    ->groupBy('study_id');
            }, 'tmp1', 'Study.id', '=', 'tmp1.study_id')
            ->joinSub(function ($query) use ($request) {
                $query->select(DB::raw("study_id, group_concat('{ \"id\": \"', filter2.id, '\", \"name\": \"', filter2.name, '\", \"dataType\": \"', filter2.dataType, '\", \"value\": \"', Statistic.value, '\" }') as statistic"))
                    ->from('Statistic')
                    ->joinSub(function ($query) use ($request) {
                        $query->from('StatisticManage');
                        $input = $request->input("statistic");
                        if (!$input)
                            return;
                        $query->whereIn('id', explode(',', $input));
                    }, 'filter2', 'Statistic.id', '=', 'filter2.id')
                    ->groupBy('study_id');
            }, 'tmp2', 'Study.id', '=', 'tmp2.study_id')
            ->orderBy("created_at", "desc")
            ->take($request->input("num", 25))
            ->get();

        foreach ($studies as $study) {
            $json = json_decode("{\"data\":[" . $study['category'] . "]}", true);
            $study['category'] = $json["data"];
            $json = json_decode("{\"data\":[" . $study['statistic'] . "]}", true);
            $study['statistic'] = $json["data"];
        }

        return $studies;
    }

    /**
     * 取出符合條件的資料，並以創建時間遞減排序
     * 
     * 可用參數：
     *   - num=n                    取出前 n 筆符合條件的資料
     *   - from=id                  篩選創建時間早於 id 的資料
     *   - p=str                    篩選標題或內文中有 str 的資料
     *   - category=id1,id2,...     篩選有類別 id1 或 id2 的資料
     *   - statistic=id1,id2,...    篩選有統計資料 id1 或 id2 的資料
     */
    public function index(Request $request)
    {
        $from = $request->input('from');
        $date = $from ? Carbon::parse(Study::find($from)['created_at'])->format('Y-m-d H:i:s') : Carbon::now()->toDateTimeString();

        $studies = Study::select('id', 'title', 'year', 'major', 'confirm', 'created_at as timestamp', 'content', 'tmp1.category', 'tmp2.statistic')
            ->where('created_at', '<=', $date)
            ->where(function ($query) use ($request) {
                $input = $request->input("p");
                if (!$input)
                    return;
                $query->where('title', 'like', '%' . $input . '%')->orWhere('content', 'like', '%' . $input . '%');
            })
            ->joinSub(function ($query) use ($request) {
                $query->select(DB::raw("study_id, group_concat('{ \"id\": \"', filter1.id, '\",\"name\": \"', filter1.name,'\" }') as category"))
                    ->from('Category')
                    ->joinSub(function ($query) use ($request) {
                        $query->from('CategoryManage');
                        $input = $request->input("category");
                        if (!$input)
                            return;
                        $query->whereIn('id', explode(',', $input));
                    }, 'filter1', 'Category.id', '=', 'filter1.id')
                    ->groupBy('study_id');
            }, 'tmp1', 'Study.id', '=', 'tmp1.study_id')
            ->joinSub(function ($query) use ($request) {
                $query->select(DB::raw("study_id, group_concat('{ \"id\": \"', filter2.id, '\", \"name\": \"', filter2.name, '\", \"dataType\": \"', filter2.dataType, '\", \"value\": \"', Statistic.value, '\" }') as statistic"))
                    ->from('Statistic')
                    ->joinSub(function ($query) use ($request) {
                        $query->from('StatisticManage');
                        $input = $request->input("statistic");
                        if (!$input)
                            return;
                        $query->whereIn('id', explode(',', $input));
                    }, 'filter2', 'Statistic.id', '=', 'filter2.id')
                    ->groupBy('study_id');
            }, 'tmp2', 'Study.id', '=', 'tmp2.study_id')
            ->orderBy("created_at", "desc")
            ->take(10)
            ->get();

        foreach ($studies as $study) {
            $json = json_decode("{\"data\":[" . $study['category'] . "]}", true);
            $study['category'] = $json["data"];
            $json = json_decode("{\"data\":[" . $study['statistic'] . "]}", true);
            $study['statistic'] = $json["data"];
        }

        return $studies;
    }

    /**
     * 新增一筆資料
     */
    public function create(Request $request)
    {
        $study = new Study;
        $uuid = Str::uuid()->toString();
        $study->id = $uuid;
        $study->title = $request->title;
        $study->year = $request->year;
        $study->major = $request->major;
        $study->confirm = $request->confirm;
        $study->content = $request->content;
        $study->timestamps = true;

        foreach ($request["category"] as $element) {
            $category = new Category;
            $category->id = $element["id"];
            $study->categories()->save($category);
        }

        foreach ($request["statistic"] as $element) {
            $statistic = new Statistic;
            $statistic->id = $element["id"];
            $statistic->value = $element["value"];
            $study->statistics()->save($statistic);
        }

        //create other statistic
        // foreach ($request["otherStatistic"] as $element) {
        //     $otherStat = new OtherStatistic;
        //     $otherStat->name = $element["name"];
        //     $otherStat->value = $element["value"];
        //     $study->otherStatistic()->save($otherStat);
        // }

        $study->save();
        return array('status' => "success");
    }


    /**
     * 更新一筆資料
     */
    public function update(Request $request)
    {
        try {
            $study = Study::findOrFail($request->id);
        } catch (Exception $e) {
            error_log("Error:" . $e);
            return array('status' => "fail");
        }

        $study->title = $request->title;
        $study->year = $request->year;
        $study->major = $request->major;
        $study->confirm = $request->confirm;
        $study->content = $request->content;

        $study->categories()->delete();
        foreach ($request["category"] as $element) {
            $category = new Category;
            $category->id = $element["id"];
            $study->categories()->save($category);
        }

        $study->statistics()->delete();
        foreach ($request["statistic"] as $element) {
            $category = new Category;
            $category->id = $element["id"];
            $study->statistics()->save($category);
        }

        $study->save();
        return array('status' => "success");
    }

    /**
     * 刪除一筆資料
     */
    public function destroy(Request $request)
    {
        try {
            $study = Study::findOrFail($request->id);
        } catch (Exception $e) {
            error_log("Error:" . $e);
            return array('status' => "fail");
        }

        $study->categories()->delete();
        $study->statistics()->delete();
        $study->delete();

        return array('status' => "success");
    }

    public function confirm(Request $request)
    {
        try {
            $study = Study::findOrFail($request->id);
        } catch (Exception $e) {
            error_log("Error:" . $e);
            return array('status' => "fail");
        }

        $study->confirm = $request->confirm;
        $study->save();

        return array('status' => "success");
    }

    public function result(Request $request)
    {
        $from = $request->input('from');
        $date = $from ? Carbon::parse(Study::find($from)['created_at'])->format('Y-m-d H:i:s') : Carbon::now()->toDateTimeString();

        $studies = Study::select('tmp2.statistic')
            ->where('confirm', true)
            ->where('created_at', '<=', $date)
            ->where(function ($query) use ($request) {
                $input = $request->input("p");
                if (!$input)
                    return;
                $query->where('title', 'like', '%' . $input . '%')->orWhere('content', 'like', '%' . $input . '%');
            })
            ->joinSub(function ($query) use ($request) {
                $query->select(DB::raw("study_id, group_concat('{ \"id\": \"', filter1.id, '\",\"name\": \"', filter1.name,'\" }') as category"))
                    ->from('Category')
                    ->joinSub(function ($query) use ($request) {
                        $query->from('CategoryManage');
                        $input = $request->input("category");
                        if (!$input)
                            return;
                        $query->whereIn('id', explode(',', $input));
                    }, 'filter1', 'Category.id', '=', 'filter1.id')
                    ->groupBy('study_id');
            }, 'tmp1', 'Study.id', '=', 'tmp1.study_id')
            ->joinSub(function ($query) use ($request) {
                $query->select(DB::raw("study_id, group_concat('{ \"id\": \"', filter2.id, '\", \"name\": \"', filter2.name, '\", \"dataType\": \"', filter2.dataType, '\", \"value\": \"', Statistic.value, '\" }') as statistic"))
                    ->from('Statistic')
                    ->joinSub(function ($query) use ($request) {
                        $query->from('StatisticManage');
                        $input = $request->input("statistic");
                        if (!$input)
                            return;
                        $query->whereIn('id', explode(',', $input));
                    }, 'filter2', 'Statistic.id', '=', 'filter2.id')
                    ->groupBy('study_id');
            }, 'tmp2', 'Study.id', '=', 'tmp2.study_id')
            ->orderBy("created_at", "desc")
            ->take($request->input("num", 25))
            ->get();

        foreach ($studies as $study) {
            $json = json_decode("{\"data\":[" . $study['statistic'] . "]}", true);
            $study['statistic'] = (array) $json['data'];
        }

        $info_list = array();
        foreach ($studies as $study) {
            foreach ($study["statistic"] as $statistic) {
                if (!array_key_exists($statistic['name'], $info_list)) {
                    $info_list[$statistic['name']]['list'] = array();
                    $info_list[$statistic['name']]['id'] = $statistic['id'];
                }
                if (!strcmp($statistic["dataType"], "int")) {
                    array_push($info_list[$statistic['name']]['list'], (int) $statistic['value']);
                } else if (!strcmp($statistic["dataType"], "float")) {
                    array_push($info_list[$statistic['name']]['list'], (float) $statistic['value']);
                }
            }
        }

        $return_list = array();
        foreach ($info_list as $name => $info) {
            if (count($info['list']) == 0) {
                array_push($return_list, array(
                    "id" => $info["id"],
                    "name" => $name,
                    "average" => "",
                    "min" => "",
                    "count" => 0
                ));
            } else {
                array_push($return_list, array(
                    "id" => $info["id"],
                    "name" => $name,
                    "average" => round(array_sum($info['list']) / count($info['list']), 2),
                    "max" => max($info['list']),
                    "min" => min($info['list']),
                    "count" => count($info['list'])
                ));
            }
        }

        return $return_list;
    }
}
