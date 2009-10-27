
# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def javascript_action_file
    js_file_path = File.join(File.dirname(__FILE__), "..", "..", "public", "javascripts", controller_name, "#{action_name}.js")
    # puts "JS File.exists?: #{js_file_path}"
    if File.exists?(js_file_path)
      javascript_include_tag File.join(controller_name, action_name)
    end
  end
end
