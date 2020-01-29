$(document).ready(function() {
  $('.add-items').submit(handleCreateItem);

  // Checkbox
  $(document).on('click', 'label', handleItemToggle);

  // Item content
  $(document).on('change', '.textbox', handleUpdateItemContent);

  // Delete mark
  $(document).on('click', '.remove', handleDeleteItem);

  // Event handlers
  function handleCreateItem(event) {
    event.preventDefault();
    var inputEl = $('#new-item');
    var title = inputEl.val();
    var placeHolder = inputEl.attr('placeholder');

    title &&
      apiHandler(
        getUrlWithEndpoint('new'),
        'POST',
        { title },
        'button',
        'Add To List',
        function(item) {
          inputEl.val('');
          inputEl.attr('placeholder', placeHolder);
          createNewListItem(item);
        }
      );
  }

  function handleUpdateItemContent() {
    var inputElement = $(this);
    var title = inputElement.val();
    handleUpdateTodo(inputElement, { title }, changeTodoTitle);
  }
  function handleItemToggle() {
    var inputElement = $(this)
      .parent()
      .find('.checkbox');
    var checked = !inputElement.attr('checked');
    handleUpdateItem(inputElement, { checked }, toggleItem);
  }
  function handleUpdateItem(checkbox, item, onSuccessCallBack) {
    var parent = checkbox.parents('.d-flex.align-items-center');
    var _id = getItemId(checkbox);
    var parentContext = parent.html();

    apiHandler(
      getUrlWithEndpoint('edit'),
      'PUT',
      { _id, item },
      parent,
      parentContext,
      onSuccessCallBack
    );
  }
  function handleDeleteItem() {
    var checkbox = $(this);
    var parent = checkbox.parents('.d-flex.align-items-center');
    var _id = getItemId(checkbox);
    var parentContext = parent.html();

    apiHandler(
      getUrlWithEndpoint('delete'),
      'DELETE',
      { _id },
      parent,
      parentContext,
      function() {
        parent.parent().remove();
      }
    );
  }

  // Helpers
  function apiHandler(
    url,
    type,
    data,
    element,
    elContext,
    onSuccess = function() {}
  ) {
    toggleLoading(element);
    $.ajax({
      url,
      type,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      success: function(response) {
        toggleLoading(element, elContext);
        console.log("SUCCES AICI!!!!!!")
        onSuccess(response);
      },
      error: function({ responseJSON }) {
        // If error type is array, this is a validation error so alert error.
        // Else, this is an connection error.
        responseJSON &&
        responseJSON.errors &&
        responseJSON.errors.length &&
        responseJSON.errors.length > 0
          ? responseJSON.errors.forEach(function({ msg }) {
              alert(msg);
            })
          : alert(
              'You must have valid internet connection in order to make create, toggle, delete operations. Your request was successfully handled by the service worker!'
            );
        console.error(responseJSON);

        toggleLoading(element, elContext);
      }
    });
  }
  function createNewListItem({ _id, title }) {
    var lineContainer = $('<div>', {
      class: 'd-flex align-items-center'
    });
    lineContainer.append(
      // Checkbox
      $('<div>', {
        class: 'custom-control custom-checkbox',
        html: $('<input>', {
          type: 'checkbox',
          class: 'checkbox custom-control-input',
          id: _id
        }).add($('<label>', { class: 'custom-control-label', for: _id }))
      })
    );
    lineContainer.append(
      // Textbox
      $('<a>', {
        href: getUrlWithEndpoint(_id),
        class: 'textbox text-info flex-grow-1 mr-3',
        role: 'button',
        html: $('<p>', {
          class: 'mb-0',
          text: title
        })
      })
    );
    lineContainer.append(
      // Remove icon
      $('<span class="remove badge badge-danger">&times;</span>')
    );

    $('#list-items').append(
      $('<li>', {
        'data-id': _id,
        html: lineContainer
      }).append($('<hr/>'))
    );
  }
  function toggleLoading(element, initialContent = false) {
    $(element)
      .toggleClass('justify-content-center')
      .html(
        initialContent
          ? initialContent
          : "<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>"
      );
  }
  function toggleItem({ _id, checked }) {
    var parent = getItemContainer(_id);
    parent.find('.textbox').toggleClass('completed');
    parent.find('.checkbox').attr('checked', checked);
  }
  function changeTodoTitle({ _id, title }) {
    getItemContainer(_id)
      .find('.textbox')
      .val(title);
  }
  function getItemContainer(id) {
    return $("li[data-id='" + id + "']");
  }
  function getItemId(checkbox) {
    var parent = checkbox.parents('li');
    var id = parent.attr('data-id');
    return id;
  }
  function getUrlWithEndpoint(endPoint) {
    return location.href + '/' + endPoint;
  }
});
