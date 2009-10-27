class EventMetasController < ApplicationController
  # GET /event_metas
  # GET /event_metas.xml
  def index
    @event_metas = EventMeta.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @event_metas }
    end
  end

  # GET /event_metas/1
  # GET /event_metas/1.xml
  def show
    @event_meta = EventMeta.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @event_meta }
    end
  end

  # GET /event_metas/new
  # GET /event_metas/new.xml
  def new
    @event_meta = EventMeta.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @event_meta }
    end
  end

  # GET /event_metas/1/edit
  def edit
    @event_meta = EventMeta.find(params[:id])
  end

  # POST /event_metas
  # POST /event_metas.xml
  def create
    # @event_meta = EventMeta.new(params[:event_meta])
    @event_meta = EventMeta.new(params[:event_meta].delete_if{ |k,v| !EventMeta.column_names.include?(k) })

    respond_to do |format|
      if @event_meta.save
        flash[:notice] = 'EventMeta was successfully created.'
        format.html { redirect_to(@event_meta) }
        format.xml  { render :xml => @event_meta, :status => :created, :location => @event_meta }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @event_meta.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /event_metas/1
  # PUT /event_metas/1.xml
  def update
    @event_meta = EventMeta.find(params[:id])

    respond_to do |format|
      if @event_meta.update_attributes(params[:event_meta])
        flash[:notice] = 'EventMeta was successfully updated.'
        format.html { redirect_to(@event_meta) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @event_meta.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /event_metas/1
  # DELETE /event_metas/1.xml
  def destroy
    @event_meta = EventMeta.find(params[:id])
    @event_meta.destroy

    respond_to do |format|
      format.html { redirect_to(event_metas_url) }
      format.xml  { head :ok }
    end
  end
end
