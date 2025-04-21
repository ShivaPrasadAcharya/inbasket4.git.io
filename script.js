// DOM Element References
const filterButton = document.getElementById('filterButton');
const filterPanel = document.getElementById('filterPanel');
const itemFilter = document.getElementById('itemFilter');
const letterContent = document.getElementById('letterContent');

// Initialize the letter pad
document.addEventListener('DOMContentLoaded', function() {
    // Populate filter dropdown with options
    populateFilterOptions();
    
    // Show first letter by default
    if (letterData.length > 0) {
        displayLetter(letterData[0]);
    }
    
    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Toggle filter panel
    filterButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event bubbling
        filterPanel.classList.toggle('show');
    });
    
    // Close filter panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!filterPanel.contains(event.target) && event.target !== filterButton) {
            filterPanel.classList.remove('show');
        }
    });
    
    // Handle filter selection
    itemFilter.addEventListener('change', function() {
        const selectedValue = this.value;
        
        if (selectedValue === 'all') {
            // Show the first letter when "All" is selected
            if (letterData.length > 0) {
                displayLetter(letterData[0]);
            }
        } else {
            // Find and display the selected letter
            const selectedLetter = letterData.find(letter => letter.itemNo === selectedValue);
            if (selectedLetter) {
                displayLetter(selectedLetter);
            }
        }
    });
}

// Populate filter options from data
function populateFilterOptions() {
    // Clear existing options
    itemFilter.innerHTML = '';
    
    // Add the default "All" option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Letters';
    itemFilter.appendChild(allOption);
    
    // Add options from letterData
    letterData.forEach((letter, index) => {
        const option = document.createElement('option');
        option.value = letter.itemNo || `item_${index + 1}`;
        option.textContent = letter.itemNo ? `Item No: ${letter.itemNo}` : `Item ${index + 1}`;
        itemFilter.appendChild(option);
    });
}

// Display letter data in the letter pad
function displayLetter(letter) {
    // Handle empty page option
    const emptyPage = letter.emptyPage || 'NO';
    const emptyPageContent = document.getElementById('emptyPageContent');
    const emptyContentContainer = document.getElementById('emptyContentContainer');
    
    // Set item number (always visible regardless of emptyPage setting)
    const itemNoContent = Array.isArray(letter.itemNo) ? letter.itemNo[0] : letter.itemNo;
    const itemNoElement = document.getElementById('itemNo');
    if (itemNoElement) {
        if (itemNoContent && itemNoContent.trim() !== '') {
            itemNoElement.textContent = itemNoContent;
            itemNoElement.classList.remove('empty');
        } else {
            itemNoElement.textContent = '';
            itemNoElement.classList.add('empty');
        }
    }
    
    // If emptyPage is YES, hide regular content and show empty page content
    if (emptyPage.toUpperCase() === 'YES') {
        letterContent.style.display = 'none';
        emptyPageContent.style.display = 'block';
        
        // Clear previous content
        emptyContentContainer.innerHTML = '';
        
        // Handle emptyEntry content if present
        if (letter.emptyEntry && letter.emptyEntry.length > 0) {
            letter.emptyEntry.forEach(item => {
                if (!item || item.trim() === '') return;
                
                // Check if the item is an image URL (local or web)
                if (item.match(/\.(jpeg|jpg|gif|png)$/i) || 
                    item.startsWith('http') || 
                    item.startsWith('www')) {
                    
                    const img = document.createElement('img');
                    img.src = item;
                    img.className = 'empty-content-image';
                    img.alt = 'Content image';
                    img.onerror = function() {
                        this.style.display = 'none';
                    };
                    emptyContentContainer.appendChild(img);
                } else {
                    // It's text content
                    const div = document.createElement('div');
                    div.className = 'empty-content-text';
                    div.textContent = item;
                    emptyContentContainer.appendChild(div);
                }
            });
        }
        
        return;
    } else {
        letterContent.style.display = 'block';
        emptyPageContent.style.display = 'none';
    }
    
    // Helper function to handle any field - can be string or array
    const displayField = (elementId, content) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Clear the element first
        element.innerHTML = '';
        
        if (!content || (Array.isArray(content) && content.length === 0)) {
            element.classList.add('empty');
            return;
        }
        
        // If the content is an array, display each item on a new line
        if (Array.isArray(content)) {
            content.forEach((item, index) => {
                if (item && item.trim() !== '') {
                    const div = document.createElement('div');
                    div.textContent = item;
                    element.appendChild(div);
                }
            });
        } else if (content && content.trim() !== '') {
            // If the content is a string, display it directly
            element.textContent = content;
        }
        
        if (element.innerHTML === '') {
            element.classList.add('empty');
        } else {
            element.classList.remove('empty');
        }
    };
    
    // Display all fields
    displayField('officeName1', letter.officeName1);
    displayField('officeName2', letter.officeName2);
    displayField('contactInfo', letter.contactInfo);
    displayField('department', letter.department);
    displayField('mainOffice', letter.mainOffice);
    displayField('entryNo', letter.entryNo);
    displayField('entryDate', letter.entryDate);
    displayField('dispatchedNo', letter.dispatchedNo);
    displayField('caseNo', letter.caseNo);
    displayField('date', letter.date);
    displayField('subject', letter.subject);
    displayField('addressedTo', letter.addressedTo);
    displayField('content', letter.content);
    
    // Handle images
    const imageGallery = document.getElementById('imageGallery');
    imageGallery.innerHTML = '';
    if (letter.images && letter.images.length > 0) {
        letter.images.forEach(image => {
            if (image && image.trim() !== '') {
                const img = document.createElement('img');
                img.src = image;
                img.className = 'letter-image';
                img.alt = '';
                imageGallery.appendChild(img);
            }
        });
        imageGallery.classList.remove('empty');
    } else {
        imageGallery.classList.add('empty');
    }
    
    // Handle signatures
    if (letter.signature1) {
        document.getElementById('signature1').textContent = letter.signature1.sign || '';
        document.getElementById('signatureName1').textContent = letter.signature1.name || '';
        document.getElementById('signaturePosition1').textContent = letter.signature1.position || '';
    } else {
        document.getElementById('signature1').textContent = '';
        document.getElementById('signatureName1').textContent = '';
        document.getElementById('signaturePosition1').textContent = '';
    }
    
    if (letter.signature2) {
        document.getElementById('signature2').textContent = letter.signature2.sign || '';
        document.getElementById('signatureName2').textContent = letter.signature2.name || '';
        document.getElementById('signaturePosition2').textContent = letter.signature2.position || '';
    } else {
        document.getElementById('signature2').textContent = '';
        document.getElementById('signatureName2').textContent = '';
        document.getElementById('signaturePosition2').textContent = '';
    }
    
    // Handle tokadesh
    displayField('tokadesh', letter.tokadesh);
    
    // Handle bodartha list
    const bodharthaList = document.getElementById('bodharthaList');
    bodharthaList.innerHTML = '';
    const bodarthaSectionContainer = document.getElementById('bodarthaSectionContainer');
    
    if (letter.bodharthaList && letter.bodharthaList.length > 0) {
        let hasContent = false;
        
        letter.bodharthaList.forEach(item => {
            if (item && item.trim() !== '') {
                const li = document.createElement('li');
                li.textContent = item;
                bodharthaList.appendChild(li);
                hasContent = true;
            }
        });
        
        if (hasContent) {
            bodarthaSectionContainer.classList.remove('empty');
        } else {
            bodarthaSectionContainer.classList.add('empty');
        }
    } else if (typeof letter.bodharthaList === 'string' && letter.bodharthaList.trim() !== '') {
        const li = document.createElement('li');
        li.textContent = letter.bodharthaList;
        bodharthaList.appendChild(li);
        bodarthaSectionContainer.classList.remove('empty');
    } else {
        bodarthaSectionContainer.classList.add('empty');
    }
    
    // Set footer information
    displayField('footerPhone', letter.footerPhone);
    displayField('footerEmail', letter.footerEmail);
}
