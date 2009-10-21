require 'test_helper'

class EventMetasControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:event_metas)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create event_meta" do
    assert_difference('EventMeta.count') do
      post :create, :event_meta => { }
    end

    assert_redirected_to event_meta_path(assigns(:event_meta))
  end

  test "should show event_meta" do
    get :show, :id => event_metas(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => event_metas(:one).to_param
    assert_response :success
  end

  test "should update event_meta" do
    put :update, :id => event_metas(:one).to_param, :event_meta => { }
    assert_redirected_to event_meta_path(assigns(:event_meta))
  end

  test "should destroy event_meta" do
    assert_difference('EventMeta.count', -1) do
      delete :destroy, :id => event_metas(:one).to_param
    end

    assert_redirected_to event_metas_path
  end
end
