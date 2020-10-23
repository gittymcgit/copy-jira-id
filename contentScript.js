function copyStringToClipboard(str) {
  if (str === undefined || str === null || !str.trim()) {
    return;
  }
  navigator.clipboard.writeText(str);
}

function isJira() {
  return document.getElementsByTagName("body")[0].getAttribute("id") === "jira";
}

function getButtonParent() {
  let idContainers = document.getElementsByClassName("aui-nav-breadcrumbs");
  let ui_version = 1;
  if (!idContainers || !idContainers.length) {
    idContainers = Array.from(
      document.getElementsByClassName(
        "BreadcrumbsItem__BreadcrumbsItemElement-sc-1hh8yo5-0"
      )
    );
    idContainers = idContainers.filter((container) =>
      container.closest(
        '[data-test-id="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"]'
      )
    );
    ui_version = 2;
  }

  if (idContainers && idContainers.length) {
    switch (ui_version) {
      case 1:
        const containers = idContainers[
          idContainers.length - 1
        ].getElementsByTagName("li");
        if (containers && containers.length) {
          return containers[0];
        }
        break;
      case 2:
        return idContainers[idContainers.length - 1];
    }
  }
}

function removeExistingButtons(container) {
  let existingButtons = container.querySelectorAll(".copy-jira-id-button");

  for (button of existingButtons) {
    button.remove();
  }
}

function createCopyButton(jiraId) {
  const copyButton = document.createElement("button");
  copyButton.classList = ["copy-jira-id-button"];
  copyButton.textContent = "COPY JIRA ID";
  copyButton.onclick = (e) => {
    copyStringToClipboard(jiraId);
    e.stopPropagation();
  };
  return copyButton;
}

function refreshBoard() {
  const board = document.querySelector('[data-test-id="software-board.board"]');
  if (!board) {
    return;
  }

  const tickets = Array.from(
    board.querySelectorAll('[data-test-id="platform-board-kit.ui.card.card"]')
  );
  tickets.forEach(function (ticket) {
    const jiraId = ticket.getAttribute("id").replace(/^.*?-/, "");
    const focusContainer = ticket.querySelector(
      '[data-test-id="platform-card.ui.card.focus-container"]'
    );
    let parent = focusContainer;
    if (
      focusContainer.children[0] &&
      focusContainer.children[0].lastChild &&
      focusContainer.children[0].lastChild.children[0]
    ) {
      parent = focusContainer.children[0].lastChild.children[0];
    }
    removeExistingButtons(parent);
    parent.insertBefore(createCopyButton(jiraId), parent.lastChild);
  });
}

function refresh() {
  if (!isJira()) {
    return;
  }
  const queryParams = new URLSearchParams(window.location.search);
  const pathElements = window.location.pathname.split("/");
  let jiraId = "";
  if (queryParams.get("selectedIssue")) {
    jiraId = queryParams.get("selectedIssue");
  } else if (pathElements.length >= 3) {
    jiraId = pathElements[2];
  }

  const copyButton = createCopyButton(jiraId);
  const buttonParent = getButtonParent();
  if (buttonParent) {
    removeExistingButtons(buttonParent);
    buttonParent.append(copyButton);
  } else {
    console.log(
      "Copy JIRA ID => Something went wrong. Report to https://github.com/AdeshAtole/copy-jira-id/issues/new"
    );
  }
}

console.log("Hello from 'Copy JIRA ID'");
refresh();
refreshBoard();
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (!mutation.addedNodes) {
      return;
    }
    mutation.addedNodes.length > 0 && console.log(mutation.addedNodes);
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      if (
        mutation.addedNodes[i].classList &&
        (mutation.addedNodes[i].classList.contains(
          "BreadcrumbsItem__BreadcrumbsItemElement-sc-1hh8yo5-0"
        ) ||
          mutation.addedNodes[i].classList.contains("Droplist-sc-1z05y4v-0") ||
          mutation.addedNodes[i].querySelector("#jira-issue-header"))
      ) {
        refresh();
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
